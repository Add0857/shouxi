/**
 * 
 */
$app.syscode = (function($){
	$syscode = {
		loading: {},
		codeList: {},
		codeMap: {},
		cb: {},
		onReady: function(kind, callback) {
			if ($app.syscode.codeList[kind]) {
				if (callback) {
					callback($app.syscode.codeList[kind])
				} 
				return $app.syscode.codeList[kind];
			}
			$app.syscode.load(kind, callback);
		},
		/**
		 * 取得代碼清單
		 */
		getCodeList: function(kind) {
			if ($app.syscode.codeList[kind]) {
				return $app.syscode.codeList[kind];
			}
			return null;
		},
		/**
		 * 取得代碼的title
		 */
		getTitle: function(kind, code) {
			
			if ( ! $app.syscode.codeMap[kind]) {
				$app.syscode.codeMap[kind] = {};
			}
			if ( ! $app.syscode.codeMap[kind][code]) {
				var codeList = $app.syscode.getCodeList(kind);
				if (codeList) {
					for(var i=0; i<codeList.length; i++) {
						var sc = codeList[i];
						$app.syscode.codeMap[kind][sc['code']] = sc['title'];
					}
				}
			}
			if ($app.syscode.codeMap[kind][code]) {
				return $app.syscode.codeMap[kind][code];
			} else {
				return code;
			}
		},
		
		load: function(kind, callback) {
			if ($app.syscode.loading[kind]) {
				
				if (callback) {
					if ( ! $app.syscode.cb[kind]) {
						$app.syscode.cb[kind] = [];
					}
					$app.syscode.cb[kind].push(callback);
				}
			} else {
				$app.syscode.loading[kind] = true;
				if ( ! $app.syscode.cb[kind]) {
					$app.syscode.cb[kind] = [];
				}
				if (callback) {
					$app.syscode.cb[kind].push(callback);
				}
				$.get($app.url + '/sys-code/get-sys-codes/' + kind, {}, function(result){
					$app.syscode.codeList[kind] = result['data']
					$app.syscode.loading[kind] = false;
					
					while($app.syscode.cb[kind].length > 0) {
						var callback = $app.syscode.cb[kind].pop();
						callback(result['data']);
					}
		        }, 'json');
			}
		}
	};
	return $syscode;
})(jQuery);