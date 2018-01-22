function changeLanguage(element, lang) {
	$app.language.change(lang);
	var $e = $(element);
	var $menu = $('#hd-function .lang span');
	$menu.html($e.html());
	$menu.toggleClass('active').parent().find('.sub-menu').slideToggle();
	
}
jQuery(document).ready(function(){
	
	//tab-block 
	$('.tab-block').each(function(index, element) {
		var hasDefault=false;
		var $tabBlock = $(this);
		$tabBlock.find('.tabs a').each(function(index, element){
			if ($(this).attr('default')) {
				$(this).addClass('active');
				$tabBlock.find('.tab-content > li').eq(index).show();
				hasDefault = true;
			}
		});
		if ( ! hasDefault) {
			$tabBlock.find('.tabs a').eq(0).addClass('active');
			$tabBlock.find('.tab-content > li').eq(0).show();
		}
    });
	
	$app.validator.init({
		errorElement: 'div', 
		errorClass: 'form-tip form-wrong',
		//validClass: 'form-tip form-ok',
		validMsgClass:'form-tip form-ok',});
	
	$app.validator.validate();
	
	$.blockUI.defaults.message = '<h4><img src="/commons/images/loading.gif"/>請稍候...</h4>';
	$.blockUI.defaults.css.border = '1px solid #bbb';
	$.blockUI.defaults.baseZ = 99999;
	
	//$app.dialog.defaults.loadingMessage = '<div class="dialog-loading"><h4><img src="/commons/images/loading.gif"/>載入中，請稍候...</h4></div>';
	$('.datepicker, input[type="date"], .date').datepicker({'dateFormat':'yy-mm-dd'});
	
	// angular 
	$app.angular.start(); // start init ng-app
	
	
	// language
	$app.language.pageInit();
	if ($app.language.current == LANG_CHS) {
		$('#hd-function .lang span').html($('#changeToChs').html());
	}
	
	// 判斷是IE9以下的版本(含)，則顯示提示改用10以上的版本或換Chrome/Firefox
	if (isIE(9, 'let')) {
		msg = "很抱歉，本站瀏覽不支援IE10以下的瀏覽器，若看見版面異常，純屬正常情況。<br/>建議您改用 <a href=\"http://www.google.com/chrome/\">Google Chrome</a> 或 <a href=\"https://moztw.org/firefox/\">Firefox</a> 以取得最佳、最快的瀏覽效果！<br/>不便之處敬請見諒！";
		//$app.dialog.notice('提示', msg, {width:600, 'position':'top'}, 0);
		 $.notify( msg , {'style':'html', className: 'warn', position:"bottom left" });//bottom center
	}
});
