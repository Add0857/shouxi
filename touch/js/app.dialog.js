var AppDialog = function (title, param) {
	var d = new Date();
	this.id = 'appDialog' + d.getTime();
	this.title = title;
	this.param = param;
	
	this.dialog = null;
	
}

AppDialog.prototype = {
	getId: function() {
		return this.id;
	}, 
	getTitle: function() {
		return this.title;
	},
	triggerFocus: function() {
		$app.dialog.current = this;
	},
	triggerClose: function() {
		for(var i=0; i<$app.dialog.dialogs.length; i++) {
			if (this.id == $app.dialog.dialogs[i].getId()) {
				$app.dialog.dialogs.splice(i, 1);
				break;
			}
		}
	},
	close: function() { alert('No implementation'); },
	showElement: function() { alert('No implementation'); },
	showUrl: function() { alert('No implementation'); },
	showMsg: function() { alert('No implementation'); },
	
};


/**
 * 對話視窗函數
 */
$app.dialog = (function($){
	$t = {
		defaults: {
			loadingMessage: '<div class="dialog-loading">載入中，請稍候...</div>',
			dialogParam: {'closable':true, 'autodestroy':true, 'draggable': true,}
		},
		dialogs: [], // 存放開啟的視窗，包含current
		current: null,
		/**
		 * 關閉目前的視窗，若有多個已開啟的視窗，則會再將上個視窗物件設定至current
		 * @returns
		 */
		closeCurrent: function() {
			if ($app.dialog.current) {
				var dialog = $app.dialog.current;
				for(var i=0; i<$app.dialog.dialogs.length; i++) {
					if (dialog.getId() == $app.dialog.dialogs[i].getId()) {
						$app.dialog.dialogs.splice(i, 1);
						break;
					}
				}
				$app.dialog.current.close();
				if ($app.dialog.dialogs.length > 0) {
					$app.dialog.current = $app.dialog.dialogs[$app.dialog.dialogs.length - 1]; 
				}
			}
		},
		/**
		 * 觸發current dialog物件的event function
		 * @param eventName
		 */
		triggerCurrent: function(eventName) {
			if ($app.dialog.current && $app.dialog.current[eventName]) {
				var event = $app.dialog.current[eventName];
				if ($.isFunction(event)) {
					event();
				}
			}
		},
		/**
		 * 設定目前的dialog物件
		 * @param $dialog
		 */
		handleCurrent: function($dialog) {
			$app.dialog.dialogs.push($dialog);
		},
		/**
		 * 顯示區塊的內容。
		 * @param title
		 * @param id 區塊的id
		 * @param param
		 */
		showElement: function(title, id, param) {
			var dialog = new AppDialog(title, $app.dialog.defaults.dialogParam);
			dialog.showElement(id, param);
			$app.dialog.handleCurrent(dialog);
		    return dialog;
		},
		/**
		 * 顯示URL的內容。
		 */
		showUrl: function(title, url, param) {
			var dialog = new AppDialog(title, $app.dialog.defaults.dialogParam);
			dialog.showUrl(url, param);
			$app.dialog.handleCurrent(dialog);
		    return dialog;
		},
		/**
		 * @deprecated 改用showMsg
		 */
		show: function(title, msg, param) {
			this.showMsg(title, msg, param);
		},
		/**
		 * 顯示訊息。
		 */
		showMsg: function(title, msg, param) {
			var dialog = new AppDialog(title, $app.dialog.defaults.dialogParam);
			dialog.showMsg(msg, param);
			$app.dialog.handleCurrent(dialog);
		    return dialog;
		},
		/**
		 * 通知訊息，3秒後自動關閉。
		 */
		notify: function(title, msg, param, seconds) {
			var dialog = $app.dialog.showMsg(title, msg, param);
			
			if (seconds == undefined) {
				seconds = 3000;
			}
			if (seconds > 0) {
				setTimeout(function(){
					dialog.close();
				}, seconds);
			}
			
			return dialog;
		},
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
			this.showMsg('注意', msg);
		},
		/**
		 * 顯示成功訊息
		 */
		success: function(msg) {
			this.showMsg('成功', msg);
		},
		/**
		 * 顯示錯誤訊息。
		 */
		error: function(errors) {
			this.showMsg('錯誤', errors);
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
			callback(confirm(msg));
		},
		/**
		 * 提示輸入訊息
		 */
		prompt: function(msg, callback) {
			callback(prompt(msg));
		},
	};
	return $t;
})(jQuery);