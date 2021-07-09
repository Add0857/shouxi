
/**
 * 查詢條件與分頁類別
 * $form - $('form')
 */
function PageQuery(param) {
	var qf = this;
	
	this.queryUrl = param['url'];
	this.queryString = '';
	
	this.id = param['id']?param['id']:'pageForm'; // 物件的ID
	this.totalRows = 0; // 總筆數
	this.totalPage = 0; // 總頁數
	this.pageSize = param['pageSize']?param['pageSize']:($app.config['pageSize']?$app.config['pageSize']:50);
	this.pageSizeOptions = $app.config['pageSizeOptions']?$app.config['pageSizeOptions']:[50];
	this.pageCount = 0; // 總頁數
	this.currentPage = 0; // 目前頁數
	this.data = []; // 查詢結果資料
	this.pageCallback = param['pageCallback']?param['pageCallback']:null;
	this.blockTarget = param['blockTarget']?param['blockTarget']:null;
	this.noDataMsg = param['noDataMsg']!==null?param['noDataMsg']:'查無資料';
	this.querying = false; // 是否查詢中
	
	this.pagebar = {'start':1, 'end':false, pages: [], 'max': $app.config['pagebarMaxPage']?$app.config['pagebarMaxPage']:10,
		setPage: function(current, total) {
			var me = qf.pagebar;
			
			me.current = current;
			me.total = total;
			if (total <= me.max) {
	            me.start = 1;
	            me.end = total;
	        } else {
	        	var p = Math.ceil(me.max / 2);
	        	
	            if (current <= p+1) {
	            	me.start = 1;
		            me.end = me.max;
	            } else if (current + p - 1 >= total) {
	                me.start = total - me.max + 1;
	                me.end = total;
	            } else {
	            	me.start = current - p;
	            	me.end= current + p - 1;
	            }
	        }

			me.pages = [];
			for(var i=me.start; i <= me.end; i++) {
				me.pages.push(i);
			}
		},	
    };
	
	
	if (param['scope']) {
		this.$scope = param['scope'];
		this.$scope.$watch(this.id + '.pageSize', function( newValue, oldValue ){
			if (newValue != oldValue) {
				qf.page();
			}
		}, true);
	}
	
}

PageQuery.prototype.setQueryParameters = function(param) {
	if (typeof param == 'string') {
		this.queryString = param;
	} else if ($.isFunction(param)) {
		this.setQueryParameters(param());
	} else if (param) {
		this.queryString = $.param(param);
	} else {
		this.queryString = '';
	}
};

PageQuery.prototype.query = function(param, callback) {
	this.setQueryParameters(param);
	this.totalRows = 0;
	this.pageCount = 0;
	this.currentPage = 0;
	this.totalPage = 0;
	this.data = [];
	this.page(callback);
};

PageQuery.prototype.page = function(callback) {
	if (this.querying) {
		$app.debug('querying is true. skip page');
		return;
	}
	this.querying = true;
	var url = 'page='+this.currentPage+'&pageSize='+this.pageSize+'&'+this.queryString;
	$app.debug('query url: ' + url);
	var qf = this;
	var cb = function(result){
		
		if (typeof(result['success']) != 'undefined') {
			if (result['success'] == false) {
				var error = result['error'] ? result['error'] : '無法取得資料，請稍候再試，或重新整理頁面。';
				if ($app.dialog) {
    				$app.dialog.error(error, 'error');
    			} else {
    				$app.notify(error, 'error');
    			}
				if (result['redirect']) {
					$app.gotoUrl(result['redirect'], 3000);
				}
				return;
			}
		}
		
		if ( ! qf.totalRows && result['total_rows']) {
			qf.currentPage = result['page'];
			qf.totalRows = result['total_rows'];
			qf.totalPage = result['total_page'];
		}

		qf.pagebar.setPage(qf.currentPage, qf.totalPage);
		
		qf.data = result['data'];
		
		if (qf.data.length == 0 && qf.noDataMsg) {
			$app.notify(qf.noDataMsg, 'info');
		}
		if (callback) {
			callback(result);
		} else if (qf.pageCallback) {
			qf.pageCallback(result);
		}
		if (qf.$scope) {
			$app.angular.apply(qf.$scope);
		}
		qf.querying = false;
	};

	if (this.blockTarget) {
		this.blockTarget.submitData(this.queryUrl, url, cb);
	} else {
		$app.submitData(this.queryUrl, url, cb);
	}
	
};

PageQuery.prototype.gotoPage = function(page, callback) {
	if (page >= 1 && page <= this.totalPage && page != this.currentPage) {
		this.currentPage = page;
		this.page(callback);
	}
};
PageQuery.prototype.firstPage = function(callback) {
	this.gotoPage(1);
};

PageQuery.prototype.previousPage = function(callback) {
	this.gotoPage(this.currentPage - 1);
};

PageQuery.prototype.nextPage = function(callback) {
	this.gotoPage(this.currentPage + 1);
};

PageQuery.prototype.lastPage = function(callback) {
	this.gotoPage(this.totalPage);
};