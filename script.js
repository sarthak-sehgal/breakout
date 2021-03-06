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
var paddleWidth = canvas.width/7;
var paddlex = (canvas.width-paddleWidth)/2;
var paddley = canvas.height-20;

// events for paddle handling
var rightKey = false;
var leftKey = false;
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// brick variables
var brickRow = 5;
var brickCol = 10;
var brickWidth = canvas.width/(brickCol+1);
var brickHeight = 20;
var brickXPadding = canvas.width/((brickCol+1)*(brickCol+1));
var brickYPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = canvas.width/((brickCol+1)*(brickCol+1));
// var colors = ["red", "green", "blue"];
var bricks=[];
for(var i=0; i<brickCol; i++)
{
	bricks[i]=[];
	for(var j=0; j<brickRow; j++)
		bricks[i][j]={x: 0, y: 0, status: 1};
}

// score variables
var score=0;

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

function collision() {
	for(i=0; i<brickCol; i++)
		for(j=0; j<brickRow; j++)
		{
			var b=bricks[i][j];
			if((x-ballRadius)>b.x && (x+ballRadius)<b.x+brickWidth && y > b.y && y < b.y+brickHeight)
			{
				dy=-dy;
				b.status=0;
				b.x=0;
				b.y=0;
				score++;
				if(score == brickRow*brickCol) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
				}
			}
		}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}

function drawBricks()
{
	for(i=0; i<brickCol; i++)
		for(j=0; j<brickRow; j++)
		{
			if(bricks[i][j].status==1)
			{	
				var brickX=brickOffsetLeft+i*(brickWidth+brickXPadding);
				var brickY=brickOffsetTop+j*(brickHeight+brickYPadding);
				bricks[i][j].x=brickX;
				bricks[i][j].y=brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				// var k=Math.floor(Math.random() * colors.length) + 0;
				ctx.fillStyle="#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
}


function draw() 
{
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	collision();
	drawScore();

	// bouncing ball on boundaries and paddle
	if((x+dx+ballRadius>canvas.width) || (x+dx-ballRadius)<0)
		dx = -dx;
	else if((y+dy-ballRadius)<0)
		dy = -dy;
	else if(y+dy+ballRadius>canvas.height)
	{
		if(x>paddlex && x<paddlex+paddleWidth)
		{
			dy=-dy;
			if(dx<0 && dx>-5)
				dx-=0.2;
			else if(dx>=0 && dx<5)
				dx+=0.2;
		}
		else
		{
			alert('GAME OVER!');
			document.location.reload();
		}
	}
	x+=dx;
	y+=dy;

	// moving paddle on key press
	if(rightKey==true && (paddlex+paddleWidth)<canvas.width)
		paddlex+=8;
	else if(leftKey==true && (paddlex)>0)
		paddlex-=8;

}
setInterval(draw, 10);