console.log('%c                                                                                                                                                  ', 'background-color: #f3cfa6;');
console.log('%c     Well hello there, my nosy friend! Feel free to roam around or drop me a line at    dan@polygoat.org    to know more about stuff I build      ','background-color: #262a40; color: #f3cfa6;');
console.log('%c                                                                                                                                                  ', 'background-color: #f3cfa6;');

jQuery(function($){
	var $win 		= $(window);
	var $body 		= $('body');

	var _resizeLastDelta = 1000;
	var _resizeLastTime = 0;
	var _resizeTimeout;

	var language = localStorage.getItem('polygoat-website-language') || 'en-US';

  	$win.on('resize', function() {
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
  	}).resize();

  	$(document)
  		.on('show.bs.modal', function(event) {
  			var $modal = $(this);
  			var $items = $modal.find('.select.languages li').removeClass('selected');
  			language = localStorage.getItem('polygoat-website-language') || 'en-US';

  			$items.filter('[data-value=' + language + ']').addClass('selected');
  		})
  		.on('click', '.select.languages li', function(event) {
  			var $this = $(this);
  			language = $this.data('value');

  			$this.addClass('selected').siblings().removeClass('selected');
  			localStorage.setItem('polygoat-website-language', language);
  			$('#languageModal').modal('hide');

  			var _langParts = language.split('-')
  			$('#languageSwitch').text((_langParts[0] + ' (' + _langParts[1] + ')').toUpperCase()).blur();
  			event.preventDefault();	
  		});

  	$('.select.languages li[data-value=' + language + ']').click();

});