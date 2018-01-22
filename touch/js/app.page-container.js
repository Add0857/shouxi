/**
 * param {'id': container id, 'pageId': current page element id, 'title': page title}
 */
function PageContainer(param) {
	var self = this;
	
	this.containerStack = new Array();
	
	var id = param && param['container'] ? param['container'] : '#container';
	if ($.type(id) === "string") {
		this.container = $(id);
	} else {
		this.container = id;
	}
	this.title = param && param['title'] ? param['title'] : $('#main-title').html();
	
	this.currentPageId = param && param['defaultPage'] ? param['defaultPage'] : $('[id]', this.container).attr('id');
	this.currentPage = $('#'+this.currentPageId);
	this.removable = false; // 回上一頁時，本頁是否移除，若false則會使用hide()
	
	/**
	 * 顯示網址
	 */
	this.showUrl = function(url, param) {
		var title = param && param['title'] ? param['title'] : null;
		var page = self.newPage(null, title);
		page.loadPage(url, param);
	}
	/**
	 * 顯示element
	 */
	this.showElement = function(id, param) {
		var title = param && param['title'] ? param['title'] : null;
		self.newPage(id, title).show();
	}
	/**
	 * 回上一頁
	 */
	this.back = function() {
		if (self.containerStack.length == 0) {
			return;
		}
		if (self.removable) {
			self.currentPage.remove();
		} else {			
			self.currentPage.hide();
		}
		
		var page = self.containerStack.pop();
		self.currentPageId = page.id;
		self.title = page.title;
		self.removable = page.removable;
		self.currentPage = $('#'+page.id);
		
		$('#main-title').html(page.title);
		self.currentPage.show();
		
		if (self.containerStack.length == 0) {
			$('#mobi-btn').show(); // 左上角選單按鈕
			$('#mobi-back-btn').hide(); // 回上一頁按鈕
		}
		
		history.replaceState({pageId: self.currentPageId}, self.title, location.href);
	}
	/**
	 * 產生新頁面
	 */
	this.newPage = function(id, title) {

		self.containerStack.push({'id': self.currentPageId, 'title': self.title, 'removable': self.removable});
		self.currentPage.hide();
		
		$('#mobi-btn').hide(); // 左上角選單按鈕
		$('#mobi-back-btn').show(); // 回上一頁按鈕
		
		if (title) {
			self.title = title;
			$('#main-title').html(title);
		}
		
		if (id) {
			self.currentPageId = id;
			self.currentPage = $('#'+id, self.container);
			if (self.currentPage.length > 0) {
				self.removable = false;
				history.pushState({pageId: self.currentPageId}, self.title, location.href);
				return self.currentPage;
			}
		} else {
			var date =new Date();
			self.currentPageId = 'page' + date.getTime();
		}
		
		self.currentPage = $('<div id="' + self.currentPageId + '"></div>');
		self.container.append(self.currentPage);
		self.removable = true;
		history.pushState({pageId: self.currentPageId}, self.title, location.href);
		
		return self.currentPage;
	}
}

$app.page = {
	init: function(param) {
		// 如果初始過就略過
		if ($app.page.container != undefined) {
			return;
		}
		$app.page.container = new PageContainer(param);
		window.onpopstate = function(event) {
			if (event.state && event.state.pageId == $app.page.container.currentPageId) {
				$app.page.back();
			}
		}
		return $app.page.container;
	},
	showUrl: function(url, param) {
		if ($app.page.container) {
			$app.page.container.showUrl(url, param);
		} else {
			$app.error('No page container.');
		}
	},
	showElement: function(id, param) {
		if ($app.page.container) {
			$app.page.container.showElement(id, param);
		} else {
			$app.error('No page container.');
		}
	},
	back: function() {
		if ($app.page.container) {
			$app.page.container.back();
		} else {
			$app.error('No page container.');
		}
	}
};