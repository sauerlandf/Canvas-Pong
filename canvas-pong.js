// Use W/S and P/L to play!

//Events
document.onkeydown = btnDown;
document.onkeyup = btnUp;

// Key checker
function btnDown(evt) {
	if (!evt)
		evt = window.event;
	var key = evt.keyCode;
	switch (key) {
	case 87:
		leftUp = true;
		break;
	case 83:
		leftDown = true;
		break;
	case 80:
		rightUp = true;
		break;
	case 76:
		rightDown = true;
		break;
	default:
		break;
	}
}

function btnUp(evt) {
	if (!evt)
		evt = window.event;
	var key = evt.keyCode;
	switch (key) {
	case 87:
		leftUp = false;
		break;
	case 83:
		leftDown = false;
		break;
	case 80:
		rightUp = false;
		break;
	case 76:
		rightDown = false;
		break;
	default:
		break;
	}
}
// End of key checker

// Function libary
function Circle(x, y, r, color, fill) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 360, false);
	ctx.closePath();
	if (fill) {
		ctx.fillStyle = color;
		ctx.fill();
	} else {
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	ctx.restore();
}

// pos: Array(x,y) Directions: 0° = Top, then clockwise
function movement(pos, direction, speed) {
	direction = direction / 360;
	direction = Math.PI * 2 * direction;
	pos[0] = pos[0] + Math.sin(direction) * speed;
	pos[1] = pos[1] - Math.cos(direction) * speed;
	return pos;
}

// Collision checker
function chkColQ(ob1pos, ob1x, ob1y, ob2pos, ob2x, ob2y) {
	var collision = (ob1pos[0] + ob1x < ob2pos[0]
			|| ob1pos[1] + ob1y < ob2pos[1] || ob1pos[0] > (ob2pos[0] + ob2x) || ob1pos[1] > (ob2pos[1] + ob2y)) ? false
			: true;
	return collision;
}

// Collision function
function symCol(direction, angle) {
	direction = direction - angle;
	while (direction < 0)
		direction = direction + 360;
	direction = 360 - direction + angle;
	while (direction >= 360)
		direction = direction - 360;
	return direction;
}

function radCol(objPos, objDir, colPos, colHgt, spread) {
	if (objPos < colPos || objPos > (colPos + colHgt))
		spread = spread;
	else {
		var collsn = colPos - objPos;
		collsn = colPos / colHgt;
		var colAgl = (180 - (spread / 2)) + collsn * spread;
		objDir = symCol(objDir, colAgl);
	}
	return objDir;
}

// End of function libary

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Game engine
function init(canvas) {

	// initialising canvas
	ctx = canvas.getContext('2d');

	fps = 30;
	gameIsOver = false;

	score = 0;

	// initialising movement/position variables
	rightBarPosition = new Array(736, 240);
	leftBarPosition = new Array(64, 240);
	BarHeight = 160;
	Bspeed = 10;

	BarVrsty = 80;

	BallPosition = new Array(416, 320);
	BallRadius = 16;
	BallMovementDirection = 45;
	BallSpeed = 12;
	BallQuadCorner = new Array(0, 0);
	BallQuadWidth = BallRadius * 2;

	leftUp = false;
	leftDown = false;
	rightUp = false;
	rightDown = false;

	ColMBar = new Array(0, 0);
	ColMBar2 = new Array(0, 608);

	frameLength = 1000 / fps;

	// start the game!!
	draw();
}

function draw() {

	// DRAW //
	// clear everything
	ctx.clearRect(0, 0, 832, 640);

	// background
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, 832, 640);

	// other static elements
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, 832, 32);
	ctx.fillRect(0, 608, 832, 32);

	// moving elements
	ctx.fillRect(leftBarPosition[0], leftBarPosition[1], 32, BarHeight);
	ctx.fillRect(rightBarPosition[0], rightBarPosition[1], 32, BarHeight);

	Circle(BallPosition[0], BallPosition[1], BallRadius, "#fff", true);

	ctx.fillStyle = "#000";
	ctx.font = "20pt Arial";
	ctx.textBaseline = "bottom";
	ctx.fillText(score, 3, 32);
	// **/ctx.fillText(BallMovementDirection, 300, 32);
	// END OF DRAWING //

	DataCalc();
}

function DataCalc() {
	// CALCULATING NEW POSITIONS //
	// Ball movement
	BallPosition = movement(BallPosition, BallMovementDirection, BallSpeed);

	// Bar movement
	if (leftUp && leftBarPosition[1] >= 32)
		leftBarPosition = movement(leftBarPosition, 0, Bspeed);
	if (leftDown && leftBarPosition[1] <= 608 - BarHeight)
		leftBarPosition = movement(leftBarPosition, 180, Bspeed);
	if (rightUp && rightBarPosition[1] >= 32)
		rightBarPosition = movement(rightBarPosition, 0, Bspeed);
	if (rightDown && rightBarPosition[1] <= 608 - BarHeight)
		rightBarPosition = movement(rightBarPosition, 180, Bspeed);
	// END OF POSITION CALCULATING //

	// CALCULATING COLLISIONS //

	BallQuadCorner[0] = BallPosition[0] - BallRadius;
	BallQuadCorner[1] = BallPosition[1] - BallRadius;

	// Collisions with static objetcts
	if (chkColQ(BallQuadCorner, BallQuadWidth, BallQuadWidth, ColMBar, 832, 32)
			&& (BallMovementDirection <= 90 || BallMovementDirection >= 270))
		BallMovementDirection = symCol(BallMovementDirection, 90);
	if (chkColQ(BallQuadCorner, BallQuadWidth, BallQuadWidth, ColMBar2, 832, 32)
			&& (BallMovementDirection >= 90 || BallMovementDirection <= 270))
		BallMovementDirection = symCol(BallMovementDirection, 90);

	// Collisions with bars
	if (chkColQ(BallQuadCorner, BallQuadWidth, BallQuadWidth, leftBarPosition,
			32, BarHeight)
			&& (BallMovementDirection >= 180))
		BallMovementDirection = symCol(BallMovementDirection, 180);

	// BallMovementDirection = radCol(BallPosition[1], BallMovementDirection,
	// leftBarPosition[1], BarHeight, BarVrsty);

	if (chkColQ(BallQuadCorner, BallQuadWidth, BallQuadWidth, rightBarPosition,
			32, BarHeight)
			&& (BallMovementDirection <= 180))
		BallMovementDirection = symCol(BallMovementDirection, 180);

	// BallMovementDirection = radCol(BallPosition[1], BallMovementDirection,
	// rightBarPosition[1], BarHeight, BarVrsty);

	if (BallPosition[0] < 0 - 16 || BallPosition[0] > 848)
		gameOver();

	if (!gameIsOver) {
		score++;
		setTimeout('draw()', frameLength);
	}
}

function gameOver() {
	gameIsOver = true;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 32, 832, 567);
	ctx.fillStyle = "#fff";
	ctx.font = "60pt Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("GAME OVER", 416, 320);
	setTimeout('Points()', 2500);
}
function Points() {
	ctx.textBaseline = "top";
	ctx.font = "20pt Arial";
	ctx.fillText("You got " + score + " Points!", 416, 390);
}
