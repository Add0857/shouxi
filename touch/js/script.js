$(function(){
	//mobile 
	$('#mobi-btn').click(function(e) {
		if ($(this).attr('login') == 'true') {
			$('#mask').fadeIn();
	        $('#mobile').animate({left:0},300);
			$('#all').addClass('active').animate({left:280},300);
			$('#header , #navigation').animate({left:280},300);
		} else {
			$app.dialog.info('請先登入會員<br>若有問題請連絡<a href="javascript:contactCsOnline()">線上客服</a>');
		}
    });
	
	$('#mobile .game-list > li').click(function(e) {
        $(this).find('.sub-menu').slideToggle().parent().siblings().find('.sub-menu').slideUp();
    });
	
	$('#mask').click(function(e) {
        $(this).hide();
		$('#mobile').animate({left:-300},300);
		$('#mobile .game-list .sub-menu').hide();
		$('#all').removeClass('active').animate({left:0},300);
		$('#header , #navigation').animate({left:0},300);
    })
})