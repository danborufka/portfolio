var firework = function firework(color1, color2) {
	var F1 = new paper.Path.Circle(paper.view.center, 1.1);
	var F2 = new paper.Path.Circle(paper.view.center,2);
	var _gap = .8;
	var speed = 1.1;

	F1.style.strokeColor = color1 || 'crimson';
	F1.style.strokeWidth = 3;
	F1.style.dashArray = [3,_gap];

	F2.style.strokeColor = color2 || 'orange';
	F2.style.strokeWidth = 2;
	F2.style.dashArray = [2,_gap];

	var _fireworkOnFrame = function fireworkOnFrame(event) {
		F1.opacity *= 0.98;
		F2.opacity *= 0.96;

		F1.scale(speed);
		F2.scale(speed * .99);
		F2.style.dashArray[1] = _gap;

		_gap *= speed;
		
		F1.style.dashArray[1] = _gap;
		if(F1.opacity < 0.3) {
			F1.off('frame', _fireworkOnFrame);
			F1.remove();
			F2.remove();
		}
	};

	return F1.on('frame', _fireworkOnFrame);
}