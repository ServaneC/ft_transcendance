/* eslint-disable */
/* enum Keys {
    UP_KEY = 38,
	DOWN_KEY = 40,
	W_KEY = 87,
	S_KEY = 83
} */

// import { Game } from "./Game"

export class Paddle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x:number, y:number, w:number, h:number) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	setXY(x: any, y: any){
		this.x = x;
		this.y = y;
	}

	setHeight(h: any) {
		this.height = h;
	}

	draw(context: any){
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
	}
}