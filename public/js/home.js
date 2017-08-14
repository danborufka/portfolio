jQuery(function($) {
	var $scroller = $('#marketing_scroll');
	var delta = $scroller[0] && ($scroller[0].scrollWidth - $scroller.width());

	if(delta) {
		$scroller.scrollLeft(delta/2);
	}
});