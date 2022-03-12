/* eslint-disable */
import {BonusType} from "../../../types/Game"
export class Bonus {
	x: number;
	y: number;
	type: number;
	size: number;

	constructor(x:number, y:number, size: number) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.type = BonusType.NONE;
	}

	setXY(x: any, y: any){
		this.x = x;
		this.y = y;
	}

	setType(type: any) {
		this.type = type;
	}

	draw(context: any){
        if (this.type != BonusType.NONE) {
			if (this.type == BonusType.SPEED)
				context.fillStyle = "#0070ff";
			else if (this.type == BonusType.PLUS)
				context.fillStyle = "#00fc17";
			else if (this.type == BonusType.MINUS)
				context.fillStyle = "#fc2c00";
			else if (this.type == BonusType.REFLECT)
				context.fillStyle = "#ff00fb";
			context.fillRect(this.x,this.y,this.size,this.size);
		}
		context.fillStyle = "#fff";
	}
}