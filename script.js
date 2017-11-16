function game() {
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// onclick events
	document.getElementById("startButton").onclick=start;
	document.getElementById("playButton").onclick=play;
	document.getElementById("startOver").onclick=refresh;

	// Ball variables
	var x = canvas.width/2;
	var y = canvas.height-30;
	var dx = 3;
	var dy = -3;
	var ballRadius=10;

	// Paddle variables
	var paddleHeight = 10;
	var paddleWidth = canvas.width/7;
	var paddleX = (canvas.width-paddleWidth)/2;
	var paddleY = canvas.height-20;

	// checking whether devuce is touch
	if(('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
		var isTouch=1;
	else
		var isTouch=0;
	console.log(isTouch);
	// events for paddle handling
	var rightKey = false;
	var leftKey = false;
	if(!isTouch)
	{
		document.addEventListener("keydown", keyDownHandler);
		document.addEventListener("keyup", keyUpHandler);
		document.addEventListener("mousemove", mouseMove);
	}
	else
	{
		document.addEventListener("touchstart", touchStart);
		document.addEventListener("touchend", touchEnd);
	}
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

	// variables for play or paused and game start
	var flag=1;
	var dxtemp;
	var dytemp;
	var started=false;

	function keyDownHandler(e)
	{
		if(e.keyCode==39 && flag==1)
			rightKey=true;
		else if(e.keyCode==37 && flag==1)
			leftKey=true;
		else if(e.keyCode==32 && flag==1 && started==true)
		{
			pause();
		}
		else if(e.keyCode==32 && flag==0 && started==true)
		{
			play();
		}
	}

	function keyUpHandler(e)
	{
		if(e.keyCode==39 && flag==1)
			rightKey=false;
		else if(e.keyCode==37 && flag==1)
			leftKey=false;
	}

	function touchStart(evt) 
	{
		xDown = evt.touches[0].clientX;                                      
	    if(xDown>canvas.width/2 && xDown<canvas.width)
			rightKey=true;
		else if(xDown>0 && xDown<=canvas.width/2)
			leftKey=true;
	}
	function touchEnd(evt) 
	{
		if(rightKey==true)
			rightKey=false;
		else if(leftKey==true)
			leftKey=false;
	}

	function mouseMove(e) 
	{
		var relativeX = e.clientX - canvas.offsetLeft;
	    if(relativeX > 0 && relativeX < canvas.width  && flag==1) {
	        paddleX = relativeX - paddleWidth/2;
	    }
	}

	function refresh()
	{
		document.location.reload();
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
		ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
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
					b.x=-1000;
					b.y=-1000;
					score++;
					if(score == brickRow*brickCol) {
	                        gameWon();
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
			if(x>paddleX && x<paddleX+paddleWidth)
			{
				dy=-dy;
				if(dx<0 && dx>-5)
					dx-=0.2;
				else if(dx>=0 && dx<5)
					dx+=0.2;
			}
			else
			{
				gameOver();
			}
		}
		x+=dx;
		y+=dy;

		// moving paddle on key press
		if(rightKey==true && (paddleX+paddleWidth)<canvas.width)
			paddleX+=8;
		else if(leftKey==true && (paddleX)>0)
			paddleX-=8;

	}
	function start()
	{
		var overlay = document.getElementById("overlay");
		overlay.style.display = 'none';
		started=true;
		setInterval(draw, 10);
	}
	function pause()
	{
		flag=0;
		var overlay = document.getElementById("overlay");
		overlay.style.display = 'flex';
		var startButton = document.getElementById("startButton");
		startButton.style.display = 'none';
		var play = document.getElementById("playButton");
		playButton.style.display = 'block';
		dxtemp = dx;
		dytemp = dy;
		dx=0;
		dy=0;
	}
	function play()
	{
		flag=1;
		var overlay = document.getElementById("overlay");
		overlay.style.display = 'none';
		var startButton = document.getElementById("startButton");
		startButton.style.display = 'none';
		var playButton = document.getElementById("playButton");
		playButton.style.display = 'none';
		dx=dxtemp;
		dy=dytemp;
	}
	function gameOver() {
		var overlay = document.getElementById("overlay");
		overlay.style.display = 'flex';
		var breakout = document.getElementById("breakout");
		breakout.innerHTML = 'GAME OVER!<br>Your score: '+score;
		var startButton = document.getElementById("startButton");
		startButton.style.display = 'none';
		var playButton = document.getElementById("playButton");
		playButton.style.display = 'none';
		var startOver = document.getElementById("startOver");
		startOver.style.display = 'block';
		dxtemp = dx;
		dytemp = dy;
		dx=0;
		dy=0;
		flag=0;
	}
	function gameWon() {
		var overlay = document.getElementById("overlay");
		overlay.style.display = 'flex';
		var breakout = document.getElementById("breakout");
		breakout.innerHTML = 'YOU WON!';
		var startButton = document.getElementById("startButton");
		startButton.style.display = 'none';
		var playButton = document.getElementById("playButton");
		playButton.style.display = 'none';
		var startOver = document.getElementById("startOver");
		startOver.style.display = 'block';
		dxtemp = dx;
		dytemp = dy;
		dx=0;
		dy=0;
		flag=0;
		started=false;
	}
	draw();
	// setInterval(draw, 10);
}
game();