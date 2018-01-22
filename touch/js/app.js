/**
 * 
 * @param $
 * @returns {___anonymous_$a}
 */
$app = (function($){
	
	// 若有notify套件，加入html的style
	if( $.notify ) {
		var $bootstrapStyle = $.notify.getStyle('bootstrap');
		$bootstrapStyle.html = "<div>\n<span data-notify-html></span>\n</div>";
		$.notify.addStyle("html", $bootstrapStyle);
	}
	
	$.ajaxSetup ({
	    // Disable caching of AJAX responses
	    cache: false
	});
	
	$a = {
		config:{
			pageSize: 50,
			pageSizeOptions: [25, 50, 100, 150, 200],
			logLevel: 4, // 0: off, 1: error, 2: warn, 3: info(log), 4: debug(trace)
		},
		controllers: {},
		extend: function(prop) {
			$.extend(true, $app, prop);	
		},
		log: function(msg) {
			$app.logger.info(msg);
		},
		error: function(msg) {
			$app.logger.error(msg);
		},
		warn: function(msg) {
			$app.logger.warn(msg);
		},
		debug: function(msg) {
			$app.logger.debug(msg);
		},
		/**
		 * 瀏覽器加入我的最愛
		 */
		addBookmark: function(sTitle, sUrl) {
			if (window.sidebar) {
		        window.sidebar.addPanel(sTitle, sUrl, "");
		    } else if(window.opera && window.print){ // opera
		        var elem = document.createElement('a');
		        elem.setAttribute('href',sUrl);
		        elem.setAttribute('title',sTitle);
		        elem.setAttribute('rel','sidebar');
		        elem.click();
		    } else if (window.external && typeof window.external.AddFavorite != 'undefined') {
		        window.external.AddFavorite(sUrl, sTitle);
		    } else if (window.chrome) {
		        $app.alert('Chrome瀏覽器請按 Ctrl+D 來加入書籤 (Mac電腦請按Command+D)');
		    }
		},
		openWindow: function(url, windowAttr, winName){
		    var targetName = winName | '_blank';
		    try {
		    	var defaultAttr = {
		    		'toolbar': 'no',
		    		'menubar': 'no',
		    		'scrollbar': 'yes',
		    		'resizable': 'yes',
		    		'location': 'no',
		    		'status': 'no',
		    		'width': 900,
		    		'height': 700,
		    	};
		    	
		    	if (typeof windowAttr != 'undefined') {
		    		windowAttr = $.extend(defaultAttr, windowAttr);
			    } else {
			    	windowAttr = defaultAttr;
			    }
		    	
		    	// 視窗居中
		    	if ( ! windowAttr['left'] && ! windowAttr['top']) {
			    	windowAttr.left = (screen.width/2)-(windowAttr.width/2);
			    	windowAttr.top = (screen.height/2)-(windowAttr.height/2);
			    }
		    	
		    	var prop = '';
		    	for(p in windowAttr) {
		    		prop += p + '=' + windowAttr[p]+',';
		    	}
		        
		        var viewwin = window.open(url, targetName, prop);
		        if (viewwin) {
		            viewwin.focus();
		        } else {
		            var $msg = $('<div>因無法直接開啟新視窗，<a href="' + url + '" target="' + targetName + '" onclick="$app.dialog.current.close();">請點選此連結開啟</a></div>');
		            $app.dialog.showElement('', $msg);
		        }
		         
		    }catch(e){
		    	var $msg = $('<div>因無法直接開啟新視窗，<a href="' + url + '" target="' + targetName + '" onclick="$app.dialog.current.close();">請點選此連結開啟</a></div>');
	            $app.dialog.showElement('', $msg);
	            
//		        alert('新開啟的視窗已被瀏覽器阻擋! 將於原視窗直接開啟!');
//		        var ttt = document.createElement("a");
//		        ttt.rel="lightbox";
//		        ttt.href=url;
//		        event.srcElement.parentNode.appendChild(ttt);
//		        ttt.click();
		    }
		},
		/**
		 * 取得遠端回傳的JSON格式資料。
		 */
		getData: function(url, param, callback) {
			$.get(url, param, function(result){
				if (result['success']) {
					callback(result['data']);
				} else {
					$app.error('無法取得資料 : ' + url);
					if (result['error']) {
						if ($app.dialog) {
							$app.dialog.error(result['error']);
						} else {
							$app.notify(result['error'], 'error');
						}
					}
					if (result['redirect']) {
						$app.gotoUrl(result['redirect'], 5000);
					}
				}
			}, 'json');
		},
		/**
		 * 送出表單資料
		 */
		submitData : function(url, data, callback, params){
			$.blockUI();
			var type = params;
			
			if (params == undefined) {
	    		type = 'json';
	    	} else if (typeof (params) == 'object') {
	    		type = params['type'] ? params['type'] : 'result';
	    	}
			
			$.post(url, data, function(result){
				try {
        			if (type == 'result') {
        				$app.processResult(result, callback, params);
        			} else {
        				callback(result);
        			}
        		} catch (err) {
        			if ($app.dialog) {
        				$app.dialog.error(err.message, 'error');
        			} else {
        				$app.notify(err.message, 'error');
        			}
        		}
	        	$.unblockUI();	
	        }, type=='result'?'json':type);
		},
		process: function(url, data, callback, params) {
			if (url && url.startsWith('/')) {
				url = $app.url + url;
			}
			if (typeof(params) == 'object') {
				$app.submitData(url, data, callback, params);
			} else {
				$app.submitData(url, data, callback, 'result');
			}
		},
		/**
		 * 處理server回傳的result資料。
		 * @param result - json資料
		 * @param callback - function | {'success': 成功的function, 'error': 錯誤處理的function, 'redirect':導向的網址}
		 * @params params - {showSuccess: 成功訊息顯示的方式，notify | dialog，設為false則不顯示, showError:錯誤訊息顯示的方式，同showSuccess}
		 */
		processResult: function (result, callback, params) {
			var successCB = null; // 若result['success']為ture或，或沒此參數時，皆呼叫successCB
			var errorCB = null;
			var redirectCB = null;
			var successMsgMethod = 'notify';
			var errorMsgMethod = 'dialog';
			if (params != undefined && params != null) {
				if (params['showSuccess'] != undefined) {
					successMsgMethod = params['showSuccess'];
				}
				if (params['showError'] != undefined) {
					errorMsgMethod = params['showError'];
				}
			}
			if (callback) {
				if (typeof(callback) === "function") {
					successCB = callback;
				} else {
					if (callback['success']) {
						successCB = callback['success'];
					}
					if (callback['error']) {
						errorCB = callback['error'];
					}
					if (callback['redirect']) {
						redirectCB = callback['redirect'];
					}
				}
			}
			
			if (result['success']) {
				if (successCB && successCB(result)) {
					return;
				}
				if (result['msg']) {
					if (successMsgMethod == 'notify' && $app.notify) {
						$app.notify(result['msg']);
					} else if (successMsgMethod == 'dialog' && $app.dialog) {
						$app.dialog.success(result['error']);
					}
				}
			} else if (result['error']) {
				if (errorCB && errorCB(result)) {
					return;
				}
				
				if (errorMsgMethod == 'dialog' && $app.dialog) {
					$app.dialog.error(result['error']);
				} else if (errorMsgMethod == 'notify' && $app.notify){
					$app.notify(result['error'], 'error');
				}
				
			} else if (result['success'] != undefined){
				if (errorMsgMethod == 'dialog' && $app.dialog) {
					$app.dialog.error('處理失敗，請洽系統管理員', 'error');
				} else if (errorMsgMethod == 'notify' && $app.notify) {
					$app.notify('處理失敗，請洽系統管理員', 'error');
				}
				if (errorCB) {
					errorCB(result);
				}
			} else if (successCB) {
				successCB(result);
			}
			
			if (result['redirect']) {
				if (redirectCB) {
					if ( !redirectCB(result)) {
						return;
					}
				}
				setTimeout(function(){
					location.href = result['redirect'];
				}, 3000);
				
			}
		},
		/**
		 * 通知訊息
		 */
		notify: function(msg, state, param) {
			if (msg instanceof Array) {
				var tmp = '';
				for(var i=0; i<msg.length; i++) {
					tmp += msg[i] + '<br/>';
				}
				msg = tmp;
			}
			
			var state = state || "success";
		    if( $.notify ) {
		    	var notifyParam = {  className: state, position:"middle center"};
		    	if (typeof param != 'undefined') {
		    		notifyParam = $.extend(notifyParam, param);
			    }
		    	$.notify( msg , notifyParam);//bottom center   
		    } else {
		        alert( msg );
		    }
		},
		/**
		 * 顯示訊息
		 * @msg 訊息
		 * @state success | info | warn | error, default: success
		 * @deprecated 改用$app.dialog.alert
		 */
		alert :  function(msg) {
			$app.dialog.alert(msg);
		},
		/**
		 * 確認訊息
		 * @deprecated 改用$app.dialog.confirm
		 */
		confirm: function(msg, callback) {
			$app.dialog.confirm(msg, callback);
		},
		/**
		 * 提示輸入訊息
		 * @deprecated 改用$app.dialog.prompt
		 */
		prompt: function(msg, callback) {
			$app.dialog.prompt(msg, callback);
		},
		/**
		 * 等待指定的時間後再轉跳至url。
		 */
		gotoUrl :function(url, ms) {
			setTimeout(function()  { location.href = url; }, ms);
		},
		
	};
	return $a;
})(jQuery);
