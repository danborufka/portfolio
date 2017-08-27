	Danimator.import('img/goathead.svg', {
							expandShapes: 	true,
							onLoad: 		function() {
												var $goat 	= $('#goat').addClass('ready');
												var self 	= this;
												var lid 	= self.eye.lid.item;
												var mask 	= self.find('clip-path')[0].item;
												var pupil 	= self.eye.look.find('pupil')[0].item;

												lid.state = 'open';

												setInterval(function() {
													lid.state = 'closed';
													setTimeout(function() {
														lid.state = 'open';
													}, 300);
												}, 3000);

												$(document).on('mousemove', function(event) {
													var pos = new Point( 	event.pageX - $goat.offset().left + 88, 
																			event.pageY - $goat.offset().top  + 74
																		);

													if(self.eye.item.hitTest(pos)) {
														pupil.position = pos;
													} else {
														pupil.position = self.eye.moPath.item.getNearestLocation( pos ).point;
													}
												});
											}
	});