/**
 * 
 */

$app.notify = function(msg, state, param) {
	if (msg instanceof Array) {
		var tmp = '';
		for(var i=0; i<msg.length; i++) {
			tmp += msg[i] + '<br/>';
		}
		msg = tmp;
	}
	
	var state = state || "success";
    if($app.dialog) {
    	//$app.dialog.notify(null, msg, {'buttons':null});
    	if (state == 'success') {
    		$app.dialog.info(msg);
    	} else if (state == 'warning') {
    		$app.dialog.warning(msg);
    	} else if (state == 'error') {
    		$app.dialog.error(msg);
    	}   
    } else {
        alert( msg );
    }
};