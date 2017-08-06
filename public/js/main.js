console.log('%c                                                                                                                                                  ', 'background-color: #f3cfa6;');
console.log('%c     Well hello there, my nosy friend! Feel free to roam around or drop me a line at    dan@polygoat.org    to know more about stuff I build      ','background-color: #262a40; color: #f3cfa6;');
console.log('%c                                                                                                                                                  ', 'background-color: #f3cfa6;');

jQuery(function($){
	var $win 		= $(window);
	var $body 		= $('body');

	var _resizeLastDelta = 1000;
	var _resizeLastTime = 0;
	var _resizeTimeout;

	var language = Cookies.get('polygoat-portfolio-language') || 'en-US';

  	_automated = false;

	$win.on('resize', function() {
	    if(!_automated) {
	  		var now = + new Date;
	    	var _oldDelta = _resizeLastDelta + 0;
	    	
	    	_resizeLastDelta = now - _resizeLastTime;
	    	_resizeLastTime = + new Date();

	    	if(_oldDelta < 1000)
	    		if(_resizeLastDelta < 1000) {
	  				$body.addClass('resizing');
	    		}
	    		
	    	clearTimeout(_resizeTimeout);
	    	_resizeTimeout = setTimeout(function() {
	    		clearTimeout(_resizeTimeout);
	    		$body.removeClass('resizing');
	    	}, 2000);
	    }
	}).resize();

  _automated = false;

	  var _translateAll = function() {
	  	var $translatables = $('.translatable');

	  	$.post('/translate', {
	  		language: language,
	  		keys: $.makeArray($translatables.map(function(){ 
	  			return $(this).data('translation-key'); 
	  		})),
	  		transformers: $.makeArray($translatables.map(function(){ 
	  			return $(this).data('translation-transformer') || ''; 
	  		}))
	  	}, function(data) {
	  		$translatables.each(function(index) {
	  			if(data.destinations[index]) {
					$(this)[data.destinations[index]](data.values[index]);
	  			} else {
	  				$(this).html(data.values[index]);
	  			}
	  		});
	  	});
	  }

	$(document)
		.on('click', '.select.languages li', function(event) {
			var $this 		= $(this);
				language 	= $this.data('value');

			var _langParts  = language.split('-');

			// update UI
			$this.addClass('selected').siblings().removeClass('selected');
			$('#languageSwitch').text((_langParts[0] + ' (' + _langParts[1] + ')').toUpperCase()).blur();
			$('#languageModal').modal('hide');

			// save cookie
			if(!_automated) {
				Cookies.set('polygoat-portfolio-language', language);
				// trigger rerendering!
				_translateAll();
			}
			
			event.preventDefault();	
		});
});