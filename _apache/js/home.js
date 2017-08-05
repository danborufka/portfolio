jQuery(function($){
	var $win 		= $(window);
	var $container  = $('#main');
	var $vr 		= $('.vr');
	var $bar 		= $('.bar');

	$container.height($win.height());

	var vpos 		= $vr.offset().top;

  	$win.on('resize', function() {
  		$container.height($win.height());

	  	var vspace = ($bar.offset().top - vpos) / 2;
	
  		$vr.height( vspace );
  		$container.css('paddingTop', vspace);
  	}).resize();

});