/**
 * 
 */
$app.logger = (function($){
	$logger = {
		LEVEL_OFF: 0,
		LEVEL_ERROR: 1,
		LEVEL_WARN: 2,
		LEVEL_INFO: 3,
		LEVEL_DEBUG: 4,
		
		error: function(msg) {
			if ($app.config.logLevel >= $logger.LEVEL_ERROR) {
				$app.logger.log($logger.LEVEL_ERROR, 'ERROR', msg);
			}
		},
		warn: function(msg) {
			if ($app.config.logLevel >= $logger.LEVEL_WARN) {
				$app.logger.log($logger.LEVEL_WARN, 'WARN', msg);
			}
		},
		info: function(msg) {
			if ($app.config.logLevel >= $logger.LEVEL_INFO) {
				$app.logger.log($logger.LEVEL_INFO, 'INFO', msg);
			}
		},
		debug: function(msg) {
			if ($app.config.logLevel >= $logger.LEVEL_DEBUG) {
				$app.logger.log($logger.LEVEL_DEBUG, 'DEBUG', msg);
			}
		},
		log: function(level, levelLabel, msg) {
			var time = new Date();
			msg = "{0} [{1}] {2}".format(time.format('yyyy-MM-dd HH:mm:ss.S'), levelLabel, msg);
			//msg = sprintf("%s [%s] %s", time.format('yyyy-MM-dd HH:mm:ss.S'), levelLabel, msg);
			switch(level) {
				case 1: console.error(msg); break;
				case 2: console.warn(msg); break;
				default: console.log(msg); break;
			}
		},
	};
	return $logger;
})(jQuery);