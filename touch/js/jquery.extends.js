/**
 * jQuery 功能的擴充 
 */
(function($){
	$ext = {
		
		/**
		 * 
		 */
		refreshCaptcha : function() {
			$src = $(this).attr('src');
			if ($src.indexOf('?') == -1) {
				$(this).attr('src', $src + '?' + Math.random());
			} else if ($src.indexOf('key') == -1) {
				var $i=$src.indexOf('?');
				$(this).attr('src', $src.substring(0, $i+1) + Math.random());
			} else {
				var $i=$src.indexOf('&');
				if ($i==-1) {
					$(this).attr('src', $src+'&'+Math.random());
				} else {
					$(this).attr('src', $src.substring(0, $i+1)+Math.random());
				}
			}
		},
		/**
		 * @url URL to load
		 * @param {'data': post data, callback: callback function, scope: $scope, compile: auto|true|false}
		 * callback function可依請求的狀態結果來執行："success", "notmodified", "error", "timeout", "parsererror"
		 */
		loadPage: function(url, param) {
			var self = this;
			var data = {};
			var cb = null;
			if (param) {
				data = param['data'] || data;
			}
			
			if ($app.dialog && $app.dialog.defaults.loadingMessage) {
				self.html($app.dialog.defaults.loadingMessage);
			} else {
				self.html('載入中，請稍候...');
			}
			
			self.load(url, data, function(responseText, textStatus, jqXHR ) {
				 var doCompile = ! param || param['compile'] == undefined ? 'auto' : param['compile'];
	            if (doCompile == 'auto') {
	            	doCompile = (param && param['scope']) || (self.find('[ng-controller]').length > 0);
	            }
	            
	            if (doCompile) {
	            	var compileParam = {};
	            	if (param && param['scope']) {
	            		compileParam['scope'] = param['scope'];
	            	}
	            	$app.angular.compile(self, compileParam);
	            } 
	            if (param) {
			        if (param[textStatus] && $.isFunction(param[textStatus])) {
			        	var cb = param[textStatus];
			        	cb(responseText, textStatus, jqXHR);
			        } else if (param['callback'] && $.isFunction(param['callback'])) {
			        	var cb = param['callback'];
			        	cb(responseText, textStatus, jqXHR);
			        }
	            }
			});
		},
		process: function(url, data, callback) {
			this.submitData(url, data, callback, 'result');
		},
		/**
		 * 使用POST方式送出資料。
		 */
	    submitData: function(url, data, callback, type) {
	    	var self = this;
	    	if (type == undefined) {
	    		type = 'json';
	    	}
	        self.block();
	        $.post(url, data, function(result){
	        	try {
        			if (type == 'result') {
        				$app.processResult(result, callback);
        			} else if (typeof(callback) == 'function'){
        				callback(result);
        			}
        		} catch (err) {
        			$app.alert(err.message, 'error');
        		}
	        	self.unblock();	
	        }, type=='result'?'json':type);
	    },
	    processForm: function(callback, param) {
	    	this.submitForm(callback, 'result', param);
	    },
	    /**
	     * 使用ajaxSubmit將Form的資料送出。
	     */
	    submitForm: function(callback, dataType, param) {
	    	var $form = $(this);
	    	if ($form.valid()) {
	    		if (dataType == undefined) {
    	    		dataType = 'json';
    	    	}
	    		var _blockFunc = function() {
	    			$form.block();
	    		};
	    		var _unblockFunc = function() {
	    			$form.unblock();
	    		};
	    		
	    		var defaultParam = {
		    			  'beforeSubmit':function(){
		    				  _blockFunc();
		    			  },
		    		      'dataType': dataType=='result'?'json':dataType, 
		    		      'success': function(result){
		    		    	  _unblockFunc();
		    		    	  
		    		    	  try {
		    		    		  if (dataType == 'result') {
	    		    				  $app.processResult(result, callback);
	    		    			  } else if (callback != undefined){
	    		    				  callback(result);
	    		    			  }
		    		    	  } catch (err) {
		    		    		  $app.alert(err.message, 'error');
		    		    	  }
		    		       },
		    		       'error': function(responseText, statusText, xhr, $form) {
		    		    	   $app.dialog.error(responseText);
		    		    	   _unblockFunc();
		    		       },
		    		};
	    		if (param) {
	    			if (param['blockUI'] == true) {
	    				_blockFunc = function() {
	    	    			$.blockUI();
	    	    		};
	    	    		_unblockFunc = function() {
	    	    			$.unblockUI();
	    	    		}
	    			}
	    			defaultParam = $.extend(defaultParam, param);
	    		}
	    		
	    		$form.ajaxSubmit(defaultParam);
	    	}
	    },
	    /**
	     * 將element定意的事件處理與ctrl的function關聯在一起
	     */
	    bindController: function(ctrl) {
	    	var $this = $(this);
	    	if (ctrl == undefined) {
	    		eval('ctrl = new ' + $this.attr('controller') + '();');
	    		$app.controllers[$this.attr('controller')] = ctrl;
	    		if (ctrl.init != undefined && typeof ctrl.init == 'function') {
	    			ctrl.init();
	    		}
	    	}
	    	
	    	$('*', $this).each(function(){
	    		var $element = $(this);
	    		var bind=false;
	    		if (this.attributes.length) {
	    			$.each(this.attributes, function(index, attr) {
	        			if (attr.name != '' && attr.value != '' && attr.name.startsWith('on-')) {
	        				var eventName = attr.name.substring(3);
	        				var eventHandler = attr.value;
	        				if (ctrl[eventHandler] != undefined && typeof ctrl[eventHandler] == 'function') {
	        					$element.on(eventName, ctrl[eventHandler]);
	        					bind = true;
	                        }
	        			}
	        		});
	    		}
	    		if (bind && $element.is('a')) {
	    			$element.attr('href', 'javascript:void(0)');
	    		}
	    	});
	    },
	    animateNum: function() {
	    	var $this = $(this);
	    	if ($this.animateNumber == undefined) {
	    		$app.error('No AnimateNumber plugin of jQuery');
	    		return;
	    	}	    	

	    	$this.each(function(){
	    		var decimal_places = 2;
	            var decimal_factor = decimal_places === 0 ? 1 : decimal_places * 10;
		    	var number = new Number($(this).text())
	    		$(this).animateNumber({
					number: number * decimal_factor,
					numberStep: function(now, tween){
						var floored_number = Math.floor(now) / decimal_factor,
							target = $(tween.elem);
						if (decimal_places > 0) {
							floored_number = floored_number.toFixed(decimal_places);
						}
						target.text(floored_number);
		    	}
		    	},1000);
	    	});
	    	

	    },
	};
	$.fn.extend($ext);

})(jQuery);

