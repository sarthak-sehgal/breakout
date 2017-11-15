var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = -3;
var ballRadius=10;

function drawBall()
{
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}

function draw() 
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBall();
	if((x+dx+ballRadius>canvas.width) || (x+dx-ballRadius)<0)
	{
		dx = -dx;
	}
	else if((y+dy+ballRadius>canvas.height) || (y+dy-ballRadius)<0)
	{
		dy = -dy;
	}
	x+=dx;
	y+=dy;
}
setInterval(draw, 10);