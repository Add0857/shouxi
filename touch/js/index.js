$(function(){
	//slider
	$('#slider').owlCarousel({
		items : 1,
		nav : true ,
		autoPlay : true
	})
	
	//news-roll
	var $marqueeUl = $('#news ul'),
		$marqueeli = $marqueeUl.append($marqueeUl.html()).children(),
		_height = $('#news').height() * -1,
		scrollSpeed = 600,
		timer,
		speed = 3000 + scrollSpeed,
		direction = 0,	
		_lock = false;
	
	$marqueeUl.css('top', $marqueeli.length / 2 * _height);
	
	$marqueeli.hover(function(){
		clearTimeout(timer);
	}, function(){
		timer = setTimeout(showad, speed);
	});
	
	$('#news .nav a').click(function(){
		if(_lock) return;
		clearTimeout(timer);
		direction = $(this).attr('class') == 'next' ? 0 : 1;
		showad();
	});
		
	function showad(){
		_lock = !_lock;
		var _now = $marqueeUl.position().top / _height;
		_now = (direction ? _now - 1 + $marqueeli.length : _now + 1)  % $marqueeli.length;
			
		$marqueeUl.animate({top: _now * _height} , scrollSpeed , function(){
			if(_now == $marqueeli.length - 1){
				$marqueeUl.css('top', $marqueeli.length / 2 * _height - _height);
			}else if(_now == 0){
				$marqueeUl.css('top', $marqueeli.length / 2 * _height);
			}
			_lock = !_lock;
		});
			
		timer = setTimeout(showad, speed);
	}
		
	timer = setTimeout(showad, speed);

	$('a').focus(function(){
		this.blur();
	});
	
	//game-list 
	$('#game-list .wrap dl a').click(function(e) {
		$('#get-game').fadeIn().css('display','table');
    });
	
	$('#get-game .close').click(function(e) {
        $('#get-game').fadeOut();
    });
});