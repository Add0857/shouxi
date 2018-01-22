/**
 * 實作AppDialog
 */
var imp = {
	/**
	 * 
	 * @param param {
	 *     message: 訊息內容,
	 *     notes: [備註訊息],
	 *     buttons: [{id: ID,  label:按鈕文字, css: 樣式名稱, style: 樣式設定, action: 事件處理function}],
	 *     onClose: 關閉事件,
	 *     onShow: 顯示事件,
	 * }
	 * @returns
	 */
	createDialog: function(param) {
		var me = this;
		var title = this.title ? '<h2>[ ' + this.title + ' ]</h2>':'';
		var message = param['message'] ? param['message'] : '';

		var $dialog = $('<div id="' + this.id + '" class="dialog-window">' + title + '<h3></h3></div>');
		if (param['title_css']) {
			$dialog.find('h2').addClass(param['title_css']);
		}
		$dialog.find('h3').append(message);
		if (param['notes']) {
			for(var i=0; i<param['notes'].length; i++) {
				$dialog.append('<p>'+param['tnotesips'][i] + '</p>');
			}
		}
		
		if (param['buttons']) {
			$buttons = $('<div class="btn"></div>');
			for(var i=0; i<param['buttons'].length; i++) {
				var btn = param['buttons'][i];
				var $btn = $('<a' + (btn['css']?' class="' + btn['css'] + '"':'') + (btn['style']?' style="' + btn['style'] + '"':'') + '>' + btn['label'] + '</a>');
				if (btn['id']) {
					$btn.attr('id', btn['id']);
				}
				if (btn['action'] && $.isFunction(btn['action'])) {
					var click = function (dialog, action) {
						return function() {
							action(dialog);
						}
					}
					$btn.on('click', click(me, btn['action']));
				}
				
				$buttons.append($btn);
			}
			$dialog.append($buttons);
		}
		
		var dialogParam = {
				autoWidth: true,
				autoCenter: true,
			    beforeClose: function() {
			    	if (closeEvent && $.isFunction(closeEvent)) {
		    			return closeEvent(me);
		    		}
			    },
			    afterClose: function() {
					me.triggerClose();
				}
			};
		
		var styleProps = ['height', 'width', 'min-width', 'max-width', 'min-height', 'max-height'];
		
		for(var i=0; i<styleProps.length; i++) {
			var prop = styleProps[i];
			if (param[prop]) {
				$dialog.css(prop, param[prop]);
				dialogParam[prop] = param[prop];
			}
		}
		
		$dialog.mouseover(function() {
	    	me.triggerFocus();
	    });
		
		var closeEvent = param['onClose'];
		
		
		if (param['onShow']) {
			dialogParam['afterShow'] = param['onShow'];
		}

		$.fancybox($dialog, dialogParam);
		
		this.dialog = $dialog;		
		
		return this.dialog;
	},
	
	showElement: function(id, param) {
		var msg;
		if (jQuery.type(id) === "string") {
			msg = $(id);
		} else {
			msg = id;
		}
		var dialogParam = $.extend({'message':msg}, this.param);
	    if (typeof param != 'undefined') {
	        dialogParam = $.extend(dialogParam, param);
	    }
	    return this.createDialog(dialogParam);
	},
	showUrl: function(url, param) {
		var me = this;
		var $message = $($app.dialog.defaults.loadingMessage); 
		
		var ready = param && param['ready'] ? param['ready'] : null;
	    

	    var dialogParam = $.extend({'message': $message, width:'auto',}, this.param);
	    
	    if (typeof param != 'undefined') {
	        dialogParam = $.extend(dialogParam, param);
	    }
	    
	    dialogParam['onShow'] = function (dialog) {
	    	$app.debug('dialog loading ' + url);
			$message.load(url, {}, function (responseText, textStatus, XMLHttpRequest) {
	            // remove the loading class
	            $message.removeClass('dialog-loading');
	            if (ready && $.isFunction(ready)) {
	            	ready(dialog);
	            }
	            var doCompile = ! param || param['compile'] == undefined ? 'auto' : param['compile'];
	            
	            if (doCompile == 'auto') {
	            	doCompile = (param && param['scope']) || (me.dialog.find('[ng-controller]').length > 0);
	            }
	            
	            if (doCompile) {
	            	$app.debug('compile dialog ' + me.getId() + '「' + me.getTitle() + '」');
	            	var compileParam = {};
	            	if (param && param['scope']) {
	            		compileParam['scope'] = param['scope'];
	            	}
	            	$app.angular.compile(me.dialog, compileParam);
	            }
	            $.fancybox.reposition();
	            $.fancybox.update();
	        });
		};
	    return this.createDialog(dialogParam);
	},
	showMsg: function(msg, param) {
		var dialogParam = $.extend({'message':msg,  width:'auto',
			buttons: [
	        {
	            label: '確定',
	            css: 'primary',
	            action: function(dialog) {
	                dialog.close();
	            }
	        }, 
	        ]
		}, $app.dialog.defaults.dialogParam);
		
		if (typeof param != 'undefined') {
	        dialogParam = $.extend(dialogParam, param);
	    }

		return this.createDialog(dialogParam);
	},
	close: function() {
		$.fancybox.close();
	}
};

$.extend(AppDialog.prototype, imp);


$.extend($app.dialog, {
	/**
	 * 顯示訊息。
	 * @param msg
	 */
	info: function(msg) {
		this.showMsg('訊息', msg);
	},
	/**
	 * 顯示警告訊息
	 */
	warning: function(msg) {
		this.showMsg('注意', msg, {'title_css':'warning'});
	},
	/**
	 * 顯示成功訊息
	 */
	success: function(msg) {
		this.showMsg('成功', msg, {'title_css':'success'});
	},
	/**
	 * 顯示錯誤訊息。
	 */
	error: function(errors) {
		this.showMsg('錯誤', errors, {'title_css':'error'});
	},
	/**
	 * 顯示訊息
	 * @msg 訊息
	 * @state success | info | warn | error, default: success
	 */
	alert :  function(msg) {
		if (msg instanceof Array) {
			var tmp = '';
			for(var i=0; i<msg.length; i++) {
				tmp += msg[i] + '<br/>';
			}
			msg = tmp;
		}
		
		this.showMsg('', msg);
	},
	/**
	 * 確認訊息
	 */
	confirm: function(msg, callback) {
		this.showMsg('', msg, {
			buttons:[
			{
	            label: '是', css: 'primary',
	            action: function(dialog) {
	                dialog.close();
	                callback(true);
	            }
	        },
	        {
	            label: '否', css: 'second',
	            action: function(dialog) {
	                dialog.close();
	                callback(false);
	            }
	        },
			], 
		});
	},
	/**
	 * 提示輸入訊息
	 */
	prompt: function(msg, callback) {
		var d = new Date();
		var id= "promptInput"+d.getTime()
		this.showMsg('', msg, {
			notes: ['<input type="text" style="width:100%" id="' + id + '"/>'],
			buttons:[
			{
	            label: '確認', css: 'primary',
	            action: function(dialog) {
	                var value = $('#' + id).val(); 
	            	dialog.close();
	                callback(value);
	            }
	        },
	        {
	            label: '取消', css: 'second',
	            action: function(dialog) {
	                dialog.close();
	                callback(null);
	            }
	        },
			], 
		});
	},
});
