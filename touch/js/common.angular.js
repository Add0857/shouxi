

function updateText($scope, element, attr,  callback) {
	if (attr.watch == 'true') {
    	$scope.$watch('value', function(value) {
    		  callback(element, value);
    	});     
	} else {
		callback(element, $scope.value);
	}
}

$app.angular
.directive('state', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.stateText(value));
        	});    
        }
    }
})
.directive('memberRole', function() {
	return {
		restrict: 'E',
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.memberRole(value));
        	});  
        }
    }
})
.directive('bulletinTarget', function() {
	return {
		restrict: 'E',
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.bulletinTarget(value));
        	});
            
        }
    }
})
.directive('cmState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.cmStateText(value));
        	});    
        }
    }
})
.directive('withdrawalsState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.withdrawalsState(value));
        	});    
        }
    }
})
.directive('bankInfoState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.bankInfoState(value));
        	});    
        }
    }
})
.directive('payment', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	element.html($app.text.paymentText($scope.value)); 
        }
    }
}).directive('depositState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	var m = {
        			'0': '<font color="#FF0000">未付款</font>',
    	    		'1': '已付款',
    	    		'2': '<font color="red">付款失敗</font>',
    	    		'3': '<font color="#999999">取消</font>',
    	    		'4': '<font color="#0000FF">待審核</font>',
    	    		'6': '<font color="#0000FF">審核中</font>',
    	    		'5': '<font color="#999999">審核不過</font>',
        	};
        	if (m[$scope.value]) {
        		element.html(m[$scope.value]);
        	} else {
        		element.html($scope.value);
        	}    
        }
    }
}).directive('activityState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	var m = {
        			'0': '<font color="#FF0000">停止</font>',
    	    		'1': '正常',
        	};
        	if (m[$scope.value]) {
        		element.html(m[$scope.value]);
        	} else {
        		element.html($scope.value);
        	}    
        }
    }
}).directive('activity', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	var m = {
        			'A01': '首儲 / 再儲紅利',
        			'A01_1': '首儲紅利',
        			'A01_2': '再儲紅利',
        			'A02': '高額返水',
    	    		'A03': '新會員紅利',
    	    		'A04': 'VIP會員',
    	    		'A05': '每月回饋最高8',
    	    		'A06_1': '歡慶元旦加碼送',
    	    		'A06_2': '歡慶元旦加碼送-救援金',
    	    		'A20_1': '發財金',
    	    		'A20_2': '歡慶聖誕',
    	    		
        	};
        	if (m[$scope.value]) {
        		element.html(m[$scope.value]);
        	} else {
        		element.html($scope.value);
        	}    
        }
    }
}).directive('vipLevel', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	updateText($scope, element, attr, function(element, value){
        		element.html($app.text.vipLevelText(value));
        	});    
        }
    }	
}).directive('money', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	var n;
        	
        	if (attr.value2) {
        		n = new Number(attr.value2);
        	} else {
        		n = new Number($scope.value);
        	}
        	
        	n = n.round(6); // 避免無限浮點數循環的問題
        	element.html(n.format());
        	if (attr.color == 'false') {
        		return;
        	}
        	
        	if (n < 0) {
        		element.css('color', '#cc0000');
        	} else if (n > 0) {
        		element.css('color', '#00aa00');
        	}
        }
    }
})
.directive('platform', function(){
	return {
        restrict: 'E',
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	element.html($app.text.platformText($scope.value));
        }
    }
}).directive('gameType', function(){
	return {
        restrict: 'E',
        scope: {'platform':'=platform', 'type': '=type', 'value': '=value'},
        link: function($scope, element, attr) {
        	var platform = $scope.platform;
        	var type = $scope.type;
        	if ( ! type) {
        		type = $scope.value;
        	}
        	element.html($app.text.gameTypeText(platform, type));
        }
    }
}).directive('betType', function(){
	return {
        restrict: 'E',
        scope: {'platform':'=platform', 'type': '=type', 'value': '=value'},
        link: function($scope, element, attr) {
        	var platform = $scope.platform;
        	var type = $scope.type;
        	if ( ! type) {
        		type = $scope.value;
        	}

        	element.html($app.text.betTypeText(platform, type));
        }
    }
}).directive('betSection', function(){
	return {
        restrict: 'E',
        scope: {'platform':'=platform', 'section': '=section', 'value': '=value'},
        link: function($scope, element, attr) {
        	var platform = $scope.platform;
        	var section = $scope.section;
        	if ( ! section) {
        		section = $scope.value;
        	}
        	element.html($app.text.betSectionText(platform, section));
        }
    }	
}).directive('rollingKind', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	element.html($app.text.rollingKindText($scope.value));    
        }
    }	
}).directive('rollingState', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	var m = {
        			'0': '<font color="#FF0000">取消</font>',
    	    		'1': '正常',
        	};
        	if (m[$scope.value]) {
        		element.html(m[$scope.value]);
        	} else {
        		element.html($scope.value);
        	}    
        }
    }
}).directive('fundsLogKind', function(){
	return {
        scope: {value: '=value'},
        link: function($scope, element, attr) {
        	element.html($app.text.fundsLogKindText($scope.value));
        }
    }
}).directive('fundsRec', function(){
	return {
        scope: {value: '=value', 'action': '=action'},
        link: function($scope, element, attr) {
        	var action = $scope.action;
        	if (attr.type == 'action') {
        		element.html(action == 'D' ? '存款' : (action == 'W' ? '提款' : action));
        	} else if (attr.type == 'state') {
        		var value = $scope.value;
        		if (action == 'D') {
        			element.html($app.text.depositState(value));
	        	} else if (action == 'W'){
	        		element.html($app.text.withdrawalsState(value));    
	        	}
        	}
        }
    };
}).directive('moneySum', function(){
	return {
        scope: {data: '=data'},
        link: function($scope, element, attr) {
        	var data = $scope.data;
        	var cols = (attr.column != undefined ? attr.column.split(',') : null);
        	var expressions = (attr.expressions != undefined ? attr.expressions :null);
        	if (cols) {
		    	for(var i=0; i<cols.length; i++) {
		    		cols[i] = cols[i].trim();
		    	}
			}
        	
			var callback = function(element, cols, expressions, color) {
				return function(data){
					var total = new Number(0);
					if (data && data.length > 0) {
		        		var row;
			        	for(var i=0; i<data.length; i++) {
			        		row = data[i];

			        		if (cols) {
			        			for(var j=0; j<cols.length; j++) {
			        				
				        			total = total.add(new Number(data[i][cols[j]]));
				        		}
			        		} else if (expressions) {
			        			eval('var n = ' + expressions + ';');
			        			total = total.add(n);
			        		}
			        	}
			        	
			        	total = total.round(6); // 避免無限浮點數循環的問題
		        	}
					
					element.html(total.format());
					
		        	if (color == 'false') {
		        		return;
		        	}
					
		        	if (total < 0) {
		        		element.css('color', '#cc0000');
		        	} else if (total > 0) {
		        		element.css('color', '#00aa00');
		        	}   
				};
			};
			
			$scope.$watch('data', callback(element, cols, expressions, attr.color)); 
        	
        }
    }
}).filter('money', function() {
    return function(amount, zero) {
    	if ( ! amount) {
    		return zero ? 0 : '';
    	}
    	var n = new Number(amount);
    	return n.format();
    };
}).filter('integer', function() {
    return function(num) {
    	if ( ! num) {
    		return 0;
    	}
    	return parseInt(num);
    };
})
;
