/**
 * 
 */
$app.member = (function($){
	var $m = {
		/**
		 * 會員資金和訊息資訊。
		 */
		info: {
			'nickname':'',
			'funds':0,
			'sa_funds':0,
			'qt_funds':0,
			'ab_funds':0,
			'og_funds':0,
			'dg_funds':0,
			'no_read_msg':0,
			'totalFunds': 0,
		},
		
		/**
		 * 銀行卡資料
		 */
		bankCards: [],
		updatingInfo: false,
		/**
		 * 更新資訊。
		 */
		updateInfo: function(callback) {
			if ($app.member.updating) {
				return;
			}
			$app.member.updatingInfo = true;
			$.get('/member/info', null, function(result){
				$app.member.updatingInfo = false;
				if (result['success']) {
					for(p in result.data) {
						$app.member.info[p] = result.data[p];
					}
					
					if (callback && typeof(callback) === "function") {
						callback(result);
					}
				} else {
					if (result['error']) {
						if ($app.dialog) {
							$app.dialog.warning(result['error']);
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
		updatingFunds: false,
		/**
		 * 更新資金資訊
		 */
		updateFunds: function(callback) {
			if ($app.member.updatingFunds) {
				return;
			}
			$app.member.updatingFunds = true;
			$app.getData('/funds/funds-data', null, function(data){
				$app.member.updatingFunds = false;
				for(p in data) {
					$app.member.info[p] = data[p];
				}
				if (callback && typeof(callback) === "function") {
					callback(data);
				}
			});
		},
		
		/**
		 * 載入銀行卡資料。
		 */
		loadBankCards: function(callback) {
			$app.getData('/bank-card/list-cards', null, function(data){
				// 不直接將data設定至bankCards，以免其他參照的物件失效
				$app.member.bankCards.length = 0;
				for(var i=0; i<data.length; i++) {
					$app.member.bankCards.push(data[i]);
				}
				if (callback && typeof(callback) === "function") {
					callback(data);
				}
			});
		},
		
	};
	return $m;
})(jQuery);

function MemberInfoController($scope) {
	$scope.memberInfo = $app.member.info;
	
	this.updateInfo = function() {
		$app.member.updateInfo(function(result){
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			    $scope.$apply();
			}
		});
	};
	
	this.quickDeposit = function() {
		//$form = $('#quickDepositDiv').html()
		var div = $('#quickDepositDiv').clone(true, true);
		div.show();
		$app.dialog.showElement('存款', div);
	};
	/**
	 * 取得資金餘額的整數位
	 */
	this.getTotalFunds = function() {
		return Math.floor($scope.memberInfo.totalFunds);
	};
	
	var updateFunds = function() {
		$scope.updateInfo();
		setTimeout(updateFunds, 60000);
	};
	
	
	setTimeout(updateFunds, 60000);
	
	$app.angular.init$scope(this, $scope);
}

$(document).ready(function(){
	$('[ng-controller="MemberInfoController"]').show();
	
});