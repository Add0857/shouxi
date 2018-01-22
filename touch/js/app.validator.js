/**
 * 
 */
$app.validator = (function($){
	
	$v = {
			
		init: function(param) {
			var defaults = {
					validMsgClass:'valid',
					onfocusout: function( element ) {
						var $element = $(element);
						var id = $element.attr('id');
						if (!id) {
							id = $element.attr('name');
						}
					    var errorElement = $.validator.defaults.errorElement;
						if($element.attr('valid-msg') && $element.valid()) {
							
							$tick = $(element.form).find(errorElement + "[for=" + id + "]");
							if ($tick.length == 0) {
								$tick = $('<'+errorElement+' for="' + id + '" class="'+$.validator.defaults.validMsgClass +'">' + $element.attr('valid-msg') + '</span>');
								if ($element.attr('msg-place')) {
									$($element.attr('msg-place')).append($tick);
								} else {
									$element.after($tick);
								}
							} else {
								$tick.show();
							}
						} else {
							$(element.form).find(errorElement + "[for=" + id + "]").hide();
						}
					},
					errorPlacement: function (error, element) {
						if (element.attr('msg-place')) {
							error.appendTo($(element.attr('msg-place')));
						} else {
							error.insertAfter( element );
						}
					},

				};
			$.extend( defaults, param );
			$.validator.setDefaults(defaults);

			
			$.extend( $.validator.messages, {
				password: "必須為5~16位半形小寫英數字",
			} );

			$.validator.addMethod('password', function(value, element) {
				if ( ! value) {
					return true;
				}
				if (value.length < 5) {
					return false;
				}
				
				var re = /^[a-zA-Z0-9]+$/g;
				//re = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;  
				return re.test(value);
				//return $app.validator.passwordStrength(value)>=3;
			});
		},
		
		validate: function(param) {
			
			var $ruleMessages = {};
			
			$('form[validate],form.validate').find('[error-msg]').each(function(){
				var $this = $(this);
				if ($this.attr('error-msg')) {
					$ruleMessages[$this.attr('name')] = $this.attr('error-msg');
				}
			});
			var defaultParam = {'messages':$ruleMessages};
			if (param) {
				$.extend( defaultParam, param );
			}
			$('form[validate], form.validate').validate(defaultParam);
		},
		/**
		 * 密碼強度檢查
		 * @return -1: password長度為0，0: 密碼長度不足6(非常弱)，1: 非常弱，2: 弱，3:中，4以上: 強
		 */
		passwordStrength: function (password) {
			 if ( ! password || password.length == 0) {
				 return -1;
			 }
			 if(password.length >=6) {
				var characters = 0;
	            var capitalletters = 0;
	            var loweletters = 0;
	            var number = 0;
	            var special = 0;

	            var upperCase= new RegExp('[A-Z]');
	            var lowerCase= new RegExp('[a-z]');
	            var numbers = new RegExp('[0-9]');
	            var specialchars = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');
	            
	            if (password.length > 8) { characters = 1; } else { characters = -1; };
                if (password.match(upperCase)) { capitalletters = 1} else { capitalletters = 0; };
                if (password.match(lowerCase)) { loweletters = 1}  else { loweletters = 0; };
                if (password.match(numbers)) { number = 1}  else { number = 0; };
                if (password.match(special)) { special = 1}  else { special = 0; };

                var total = characters + capitalletters + loweletters + number + special;
                return total;
                
			 }else{
				 return 0; 
			 }
		},
	};
	return $v;
})(jQuery);	
// validator
	
	
	
	
	