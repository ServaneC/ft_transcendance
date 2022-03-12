export class Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	speed: number = 5;
	yVel: number = 0;
  
	constructor(w: number, h: number) {
	  this.width = w;
	  this.height = h;
	}

	setXY(x: number, y: number) {
	  this.x = x;
	  this.y = y;
	}

	setY(y: number) {
	  this.y = y;
	}

	setHeight(h: number) {
		this.height = h;
	}
}