/**
 * 
 */
var platformId=''
$(document).ready(function(){
	// keep login state
	setInterval(function(){
		 $.get('/home/hello/'+platformId, null, function(result){
			 if ( ! result['success']) {
				 if (result['error']) {
					 alert(result['error']);
				 }
				 if (result['url']) {
					 location.href = result['url'];
				 } else if (result['reload']) {
					 location.reload();
				 }
			 }
		 }, 'json');
   }, 90000);
});