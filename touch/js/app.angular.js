/**
 * 
 */
function AppController($ctrl, $injects) {
	var self = this;
	this.name = '';
	this.injects = $injects ? $injects : ['$scope'];
	this.controller = null;
	
	var ctrl;
	if (typeof $ctrl == 'object') {
		this.name = $ctrl.attr('ng-controller');
		var inj = $ctrl.attr('injects');
		if (inj) {
			this.injects = inj.split(',');
		} else {
			inj = $ctrl.attr('inject');
			if (inj) {
				this.injects = [inj];
			}
		}
		
		eval('ctrl = ' + this.name + ';');
		
	} else if (typeof $ctrl == 'string') {
		this.name = $ctrl;
		eval('ctrl = ' + this.name + ';');
	
	} else if (typeof $ctrl == 'function') {
		var result = /^function\s+([\w\$]+)\s*\(/.exec( $ctrl.toString() );
		this.name = result  ?  result[ 1 ]  :  '';
		ctrl = $ctrl;
	}
	
	ctrl.$inject = this.injects;
	this.controller = ctrl;
}

function getAngularConfig(app) {
	return function( $controllerProvider, $provide, $compileProvider ) {
		// Since the "shorthand" methods for component
		// definitions are no longer valid, we can just
		// override them to use the providers for post-
		// bootstrap loading.
		console.log( "Config method executed." );
		// Let's keep the older references.
		app._controller = app.controller;
		app._service = app.service;
		app._factory = app.factory;
		app._value = app.value;
		app._directive = app.directive;
		// Provider-based controller.
		app.controller = function( name, constructor ) {
			$controllerProvider.register( name, constructor );
			return( this );
		};
		// Provider-based service.
		app.service = function( name, constructor ) {
			$provide.service( name, constructor );
			return( this );
		};
		// Provider-based factory.
		app.factory = function( name, factory ) {
			$provide.factory( name, factory );
			return( this );
		};
		// Provider-based value.
		app.value = function( name, value ) {
			$provide.value( name, value );
			return( this );
		};
		// Provider-based directive.
		app.directive = function( name, factory ) {
			$compileProvider.directive( name, factory );
			return( this );
		};
		// NOTE: You can do the same thing with the "filter"
		// and the "$filterProvider"; but, I don't really use
		// custom filters.
	};
}

function AppAngular($ngApp) {
	var self = this;
	
	this.name = $ngApp.attr('app');
	
	this.$ngApp = $ngApp;
	this.dependencies = [];
	this.controllers = {};
	self.module = null;
	
	// init dependencies
	var d = $ngApp.attr('dependencies');
	if (d) {
		this.dependencies = d.split(',');
	} else {
		d = $ngApp.attr('dependency');
		if (d) {
			this.dependencies.push(d);
		}
	}
	
	this.addController = function(appCtrl) {
		if ( ! this.controllers[appCtrl.name]) {
			this.module.controller(appCtrl.name, appCtrl.controller);
			this.controllers[appCtrl.name] = appCtrl;
			$app.log('register controller ' + appCtrl.name + ' to ' + self.name + ' app');
		}
	};
	
	this.init = function() {
		self.module = angular.module(self.name, self.dependencies);
		self.module.config(getAngularConfig(self.module));
		
		// set directives
		for(p in $app.angular.directives) {
			self.module.directive(p, $app.angular.directives[p]);
		}
		// set filters
		for(p in $app.angular.filters) {
			self.module.filter(p, $app.angular.filters[p]);
		}
		// set services
		for(p in $app.angular.services) {
			self.module.service(p, $app.angular.services[p]);
		}
		// set common controllers
		for(p in $app.angular.controllers) {
			self.module.controller(p, $app.angular.controllers[p].controller);
		}
		// config
		if ($app.angular.configs[self.name] != undefined) {
			self.module.config($app.angular.configs[self.name]);
		}
		// run init
		if ($app.angular.runs[self.name] != undefined) {
			self.module.run($app.angular.runs[self.name]);
		}
		
		
		// init controller
		$('[ng-controller]', self.$ngApp).each(function(){
			var appCtrl = new AppController($(this));
			
			$app.log("init controller '" + appCtrl.name + "'");
			
			self.module.controller(appCtrl.name, appCtrl.controller);
			//eval('app.controller("'+appCtrl.name + '", ' + appCtrl.name + ');');
			self.controllers[appCtrl.name] = appCtrl;
		});
	}
}
$app.angular = (function($){
	$ng = {
		$injector: null, // $app.angular.start之後會取得angular的injector
		modules: {},
		directives: {}, // 存放共用的directive
		filters: {}, // 存放共用的 filter
		services: {}, // 存放共用的service
		controllers: {}, // 存放共用的controller
		runs: {},
		configs: {},
		init$scope: function(obj, $scope) {
			for(p in obj) {
				$scope[p] = obj[p];
			}
			return $app.angular;
		},
		directive: function(name, param) {
			for(name in this.modules) {
				this.modules[name].module.directive(name, param);
			}
			this.directives[name] = param;
			return this;
		},
		filter: function(name, param) {
			for(name in this.modules) {
				this.modules[name].module.filter(name, param);
			}
			this.filters[name] = param;
			return $app.angular;
		},
		service: function(name, param) {
			for(name in this.modules) {
				this.modules[name].module.service(name, param);
			}
			this.services[name] = param;
			return this;
		},
		run: function(appName, f) {
			if (this.modules[appName] != undefined) {
				this.modules[appName].module.run(f);
			}
			this.runs[appName] = f;
		},
		config: function(appName, f) {
			if (this.modules[appName] != undefined) {
				this.modules[appName].module.config(f);
			}
			this.configs[appName] = f;
		},
		controller: function(ctrl, $inject) {
			var appCtrl = new AppController(ctrl, $inject);
			if ( ! this.controllers[appCtrl.name]) {
				for(name in this.modules) {
					this.modules[name].addController(appCtrl);
				}
				
				this.controllers[appCtrl.name] = appCtrl;
			}
		},
		start: function(ext) {
			if (ext) {
				 $.extend($app.angular, ext);
			}
		
			var modules = [];
			$('[app]').each(function(){
				
				var aa = new AppAngular($(this));
				
				$app.log("init app '" + aa.name + "'");
				
				aa.init();
				$app.angular.modules[aa.name] = aa;
				modules.push(aa.name);
			});
			
			$app.angular.$injector = angular.bootstrap(document, modules);
		},

	    /**
	     * Compile : Compile html with the rootScope of an application
	     */
	    compile: function ($targetDom, param) {
	        var $injector = $app.angular.$injector;
	        if ( ! $injector){
	        	return;
	        }
	        
	        if (param) {
	        	if (param['app']) {
	        		$injector = angular.injector(["ng", param['app']]);
	        	}
	        }
	        if ($targetDom.scope == undefined) {
	        	$targetDom = angular.element($targetDom);
	        }
	        
	    	$injector.invoke(["$compile", "$rootScope", function ($compile, $rootScope) {
	            //Get the scope of the target, use the rootScope if it does not exists
	            var $scope = $targetDom.scope();
	            if (param && param['scope']) {
	            	$scope = param['scope'];
	            }
	            $compile($targetDom)($scope || $rootScope);
	            
	            $rootScope.$digest();
	        }]);
	    },
	    apply: function($scope) {
	    	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			    $scope.$apply();
			}
	    },
		
	};
	return $ng;
})(jQuery);

$app.angular.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})
.directive('compilehtml', ["$compile", "$parse", function($compile, $parse) {
    return {
        restrict: 'A',
        link: function($scope, element, attr) {
            var parse = $parse(attr.ngBindHtml);
            function value() { return (parse($scope) || '').toString(); }

            $scope.$watch(value, function() {
                $compile(element, null, -9999)($scope); 
            });
        }
    }
}])
.filter('nl2br', function($sce){
    return function(msg, is_xhtml) { 
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
})
.filter('htmlToPlaintext', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
      };
})
.filter('unsafe', function($sce) { return $sce.trustAsHtml; })
;   