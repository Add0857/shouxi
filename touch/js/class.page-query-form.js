
/**
 * 查詢條件與分頁類別
 * $form - $('form')
 */
function PageQueryForm($form, param) {
	var qf = this;
	
	qf.form = $form;
	
	if ( ! param) {
		param = {};
	}
	param['url'] = $form.attr('action');
	
	this.base = PageQuery;
	this.base(param);
	
	// 查詢結果每筆資料前的checkbox
	this.checkedAll = false;
	this.selected = [];
	this.selectAll = function(checked, name) {
		if (checked) {
			if ( ! name) {
				name = 'no';
			}
			qf.selected = qf.data.map(function(item) { return item[name]; });
		} else {
			qf.selected = [];
		}
	};
	
	this.query = function(callback) {
		if (qf.form.attr('validate') || qf.form.hasClass('validate')) {
			if ( ! qf.form.valid()) {
				return;
			}
		}
	
		this.queryString = qf.form.formSerialize();
		this.totalRows = 0;
		this.pageCount = 0;
		this.currentPage = 0;
		this.totalPage = 0;
		this.data = [];
		qf.page(callback);
	};
	
}

PageQueryForm.prototype = PageQuery.prototype;