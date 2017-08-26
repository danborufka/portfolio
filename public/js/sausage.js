
	Danimator.import('img/marketing-sausage.svg', 
	{
		expandShapes: true,
		onLoad: function() {
			var $sausage 		= $('#sausage').addClass('ready');
			var $doc 			= $(document);
			var _viz;

			var elSelf 			= this;
			var scene 			= elSelf.item;

			var elSausage 		= elSelf.sausage;
			var elMoPath		= elSelf.motionPath;
			var elSpine 		= elSausage.spine;

			var sausage 		= elSausage.item;
			var moPath			= elMoPath.item;
			var spine 			= elSpine.item;
			var label 			= elSelf.label.item;

			// normalize lengths to data store
			var sausage_length 	= elSausage.spine.item.getLength();
			var moPath_length  	= elMoPath.item.getLength();

			var TOLERANCE 		= elMoPath.item.strokeWidth + 20;
			var ANGLE_OFFSET 	= 90;

			// motion path is reversed, let's fix that here
			moPath.reverse();
			// hide spine, we only need it for processing
			spine.visible = false;

			// get all bendable's segments and store offset from sausage's center
			if(elSausage.bendables) {
				elSpine.data._bendableSegments = [];
				_.each(spine.segments, function(segment, i) {
					elSpine.data._bendableSegments[i] = segment.point - sausage.position;
				});

				_.each(elSausage.bendables, function(elBendable) {
					elBendable.data._bendableSegments = [];
					_.each(elBendable.item.segments, function(segment, i) {
						elBendable.data._bendableSegments[i] = segment.point - sausage.position;
					});
				});
			}

			// bends all bendables of sausage and keeps head in place/rotated
			var _bend = function(offset) {
				_.each(elSausage.bendables, function(elBendable) {
					_.each(elBendable.data._bendableSegments, function(_centerOffset, i) {
						var _segmentOffset 	= Danimator.limit( offset + _centerOffset.x, 0, moPath_length );
						var _yOffset 		= moPath.getNormalAt( _segmentOffset ) * _centerOffset.y;
						var _point			 = moPath.getPointAt( _segmentOffset );
						var _scale 			= .2;		// down-scaling of tangents

						if(_point) {
							elBendable.item.segments[i].point 		= _point + _yOffset;
							elBendable.item.segments[i].handleIn 	= moPath.getWeightedTangentAt( _segmentOffset ) * 1  * _scale;
							elBendable.item.segments[i].handleOut 	= moPath.getWeightedTangentAt( _segmentOffset ) * -1 * _scale;
						}

					});
					elBendable.item.smooth();
				});

				// positioning and rotation of head
				var head = elSausage['head-1'].item;
				var _tail = Danimator.limit(offset + sausage_length/2, 0, moPath_length-.001);

				head.position = moPath.getPointAt(  _tail ) - [0,5];
				head.rotation = moPath.getNormalAt( _tail ).angle + ANGLE_OFFSET;

				// positioning of "that's me" label
				var _peak = new Point(moPath.getPointAt( offset ).x, moPath.bounds.top);
				var _hit = moPath.hitTest( _peak, { tolerance: 250, fill: false, stroke: true });

				if(_hit) {
					Danimator(label, 'position.x', null, _hit.point.x, .6);
					Danimator(label, 'position.y', null, Math.max(_hit.point.y - 40, 0), .6);
				}

			}

			// global canvas resize handler
			$(window).on('resize', function(event) {
				var isMobile = $('.checker.hidden-xs').is(':hidden');
				
				if(!isMobile) {
					var docWidth = $doc.width() - 20;
					var factor = docWidth / paper.view.viewSize.width;

					paper.view.scale(factor, paper.view.bounds.leftCenter);
					paper.view.translate(new Point(factor * 20, 0));
					paper.view.viewSize.width = docWidth;
					$sausage.width(docWidth);
				}

			}).trigger('resize');

			// bend on mousemove
			scene.on('mousemove', function(event) {
				var hitTest = moPath.hitTest(event.point, { tolerance: TOLERANCE, fill: false, stroke: true });

				if(hitTest) {
					_bend(hitTest.location.offset);
/* 
					for debugging:

					_viz && _viz.remove();
					moPath.fullySelected = false;
					hitTest.location.segment.selected = true;

					var _c = new Path.Circle(hitTest.point, TOLERANCE);
					_c.strokeColor = 'black';

					var _a = new Path.Circle(moPath.getPointAt(Math.max(hitTest.location.offset - sausage_length/2, 0)), 10);
					_a.fillColor = 'crimson';

					var _b = new Path.Circle(moPath.getPointAt(Math.min(hitTest.location.offset + sausage_length/2), moPath_length), 10);
					_b.fillColor = 'limegreen';

					_viz = new Group([_a, _b, _c]);
					scene.addChild(_viz);
*/
				}
			});
			_bend(1009);	// preposition at "r"
		}
	});