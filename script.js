var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Ball variables
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = -3;
var ballRadius=10;

// Paddle variables
var paddleHeight = 10;
var paddleWidth = canvas.width/5;
var paddlex = (canvas.width-paddleWidth)/2;
var paddley = canvas.height-20;

// events for paddle handling
var rightKey = false;
var leftKey = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e)
{
	if(e.keyCode==39)
		rightKey=true;
	else if(e.keyCode==37)
		leftKey=true;
}

function keyUpHandler(e)
{
	if(e.keyCode==39)
		rightKey=false;
	else if(e.keyCode==37)
		leftKey=false;
}

function drawBall()
{
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle()
{
	ctx.beginPath();
	ctx.rect(paddlex, paddley, paddleWidth, paddleHeight);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}

function draw() 
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBall();
	drawPaddle();

	// bouncing ball on boundaries
	if((x+dx+ballRadius>canvas.width) || (x+dx-ballRadius)<0)
		dx = -dx;
	else if((y+dy+ballRadius>canvas.height) || (y+dy-ballRadius)<0)
		dy = -dy;
	x+=dx;
	y+=dy;

	// moving paddle on key press
	if(rightKey==true && (paddlex+paddleWidth)<canvas.width)
		paddlex+=5;
	else if(leftKey==true && (paddlex)>0)
		paddlex-=5;
}
setInterval(draw, 10);