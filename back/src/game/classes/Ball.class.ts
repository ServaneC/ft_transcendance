export class Ball {
	x: number;
	y: number;
	size: number;
  
	speed = 5;
	xVel = 0;
	yVel = 0;
  
	constructor(size: number) {
	  this.size = size;
	}
  
	setXY(x: number, y: number) {
	  this.x = x;
	  this.y = y;
	}
}