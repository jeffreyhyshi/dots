var CANV_WIDTH = $("#myCanvas").width();
var CANV_HEIGHT = $("#myCanvas").height();

var colorNumbers;


//waits for document to initialize before running
$(document).ready(function () {

	//Circle class
	function Circle (radius, color) {
		this.x = Math.floor(Math.random() * CANV_WIDTH);
		this.y = Math.floor(Math.random() * CANV_HEIGHT);

		this.radius = radius;

		this.isColliding = function (circle2) {
			return Math.sqrt(Math.pow(this.x - circle2.x, 2) + Math.pow(this.y - circle2.y, 2)) < this.radius + circle2.radius + 1;
		};

		this.isCollidingWithAnyCircle = function (arrayName) {
			for (var i = 0; i < arrayName.length; i++) {
				if (arrayName[i] != this) {
					if (this.isColliding(arrayName[i])) {
						return true;
					}
				}
			};
			return false;
		};

		this.isOnEdge = function() {
			return !((this.x > this.radius && this.x < CANV_WIDTH - this.radius) && 
				(this.y > this.radius && this.y < CANV_HEIGHT - this.radius));
		}

		this.fixXYPos = function(arrayName) {
			while(this.isCollidingWithAnyCircle(arrayName) || this.isOnEdge()) {
				this.x = Math.floor(Math.random() * CANV_WIDTH);
				this.y = Math.floor(Math.random() * CANV_HEIGHT);
			}
		}

		this.drawCircle = function (ctx) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(this.x, this.y,radius,0,2*Math.PI);
			ctx.fill();
		};

	}

	var makeCircleList = function(circles,color1, color2, radii, numCircles, diff) {
		var firstPart = 0;
		var secondPart = 0;
		while (firstPart == secondPart) {
			firstPart = (Math.floor(numCircles / 2) - Math.floor(diff / 2)) + Math.round(Math.random() * diff);
			secondPart = numCircles - firstPart;
		}
		for (var i = 0; i < firstPart; i++) {
			circles[i] = new Circle(radii, color1);
		};
		for (var i = firstPart; i < firstPart + secondPart; i++) {
			circles[i] = new Circle(radii, color2);
		};
		colorNumbers = [firstPart, secondPart];
	}

	var randomColor = function() {
		return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255)
			+ ',' + Math.floor(Math.random() * 255) + ')';
	}

	var colorSquares = function(color1, color2) {
		$("#left").css("background-color", color1);
		$("#right").css("background-color", color2);
	};

	var winCheck = function(element, nums) {
		if (element.attr('id') == "left") {
			if (nums[0] > nums[1]) {
				handleResult(true, element);
			} else {
				handleResult(false, element);
			}
		} else if (element.attr('id') == "right") {
			if (nums[1] > nums[0]) {
				handleResult(true, element);
			} else {
				handleResult(false, element);
			}
		}
	};

	var handleResult = function(won, element) {
		if (won) {
			winCount++;
			// $("#win").fadeIn(100).delay(300).fadeOut(100).delay(500);
		} else {
			loseCount++;
			// $("#lose").fadeIn(100).delay(300).fadeOut(100).delay(500);
		}
		$("#correct").text(winCount);
		$("#incorrect").text(loseCount);

		setTimeout(function(){runGame(15,50,0,1000);}, 0);
	};

	var runGame = function(circSize,num,diff,flash) {
		var circles = new Array();
		//Constants: Canvas width and height
		var color1 = randomColor();
		var color2 = randomColor();
		var numCircles = num;
		//the lower the difficulty, the harder it is. zen as fuck, baby.
		var difficulty = diff;
		makeCircleList(circles,color1, color2, circSize, numCircles, difficulty);
		var time = flash;
		ctx.clearRect(0,0,CANV_WIDTH,CANV_HEIGHT);
		for (var i = 0; i < circles.length; i++) {
			circles[i].fixXYPos(circles);
			circles[i].drawCircle(ctx);
		};
		setTimeout(function() {
			ctx.clearRect(0,0,CANV_WIDTH,CANV_HEIGHT);
		}, time);
		colorSquares(color1, color2);
	}

	$(".box").mousedown(function() {
		$(this).css("box-shadow", "0px 3px 5px rgba(50, 50, 50, 0.5)");
		$(this).css("-mox-box-shadow", "0px 3px 5px rgba(50, 50, 50, 0.5)");
		$(this).css("-webkit-box-shadow", "0px 3px 5px rgba(50, 50, 50, 0.5)");

	});

	$(".box").mouseup(function() {
		$(this).css("box-shadow", "0px 3px 10px rgba(50, 50, 50, 0.75)");
		$(this).css("-mox-box-shadow", "0px 3px 10px rgba(50, 50, 50, 0.75)");
		$(this).css("-webkit-box-shadow", "0px 3px 10px rgba(50, 50, 50, 0.75)");
		winCheck($(this), colorNumbers);
	});

	var c = $("#myCanvas")[0];
	var winCount = 0;
	var loseCount = 0;

	if (c.getContext) {
			var ctx = c.getContext("2d");
			runGame(15,50,50,1000);
	}

})

