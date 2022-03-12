/* eslint-disable */
import { Paddle } from './Paddle';
import { Ball } from './Ball';
import { GameOptionsInterface, GameDataUpdate, GameState } from '@/types/Game';
import io, { Socket } from "socket.io-client";
import { Bonus } from './Bonus';

enum Keys {
    P_KEY = 80,
	L_KEY = 76,
	W_KEY = 87,
	S_KEY = 83
}

export class Game {
	gameOptions: GameOptionsInterface;
	uuid: number;
	playerSide: string;
	playerId: string;
	canvas: any;
	context: any;
	socket: Socket;
	state: GameState = GameState.WAITING_ALL;
	upPressed: boolean = false;
	downPressed: boolean = false;
	public static keysPressed: boolean[] = [];

	
	player1: Paddle;
	player2: Paddle;
	ball: Ball;
	bonus: Bonus;

	player1Score: number;
	player2Score: number;


	constructor(socket: Socket, gameOptions: GameOptionsInterface, uuid: number, playerSide: string, playerId: string){
		this.socket = socket;
		this.state = GameState.WAITING_ALL;
		this.gameOptions = gameOptions;
		this.uuid = uuid;
		this.playerSide = playerSide;
		this.playerId = playerId;
		this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
		this.context = this.canvas.getContext("2d");
        this.context.font = "50px Arial";
		
		this.canvas.width = this.gameOptions.CANVAS_WIDTH;
		this.canvas.height = this.gameOptions.CANVAS_HEIGHT;

		window.addEventListener("keydown",function(e){
			Game.keysPressed[e.which] = true;
		});
		 
		window.addEventListener("keyup",function(e){
			Game.keysPressed[e.which] = false;
		});
		
		this.player1Score = 0;
		this.player2Score = 0;
		
		this.player1 = new Paddle(this.gameOptions.PADDLE_MARGIN!, this.gameOptions.CANVAS_HEIGHT! / 2 - this.gameOptions.PADDLE_HEIGHT! / 2, this.gameOptions.PADDLE_WIDTH!, this.gameOptions.PADDLE_HEIGHT!);
		this.player2 = new Paddle(this.gameOptions.CANVAS_WIDTH! - (this.gameOptions.PADDLE_MARGIN! + this.gameOptions.PADDLE_WIDTH!), this.gameOptions.CANVAS_HEIGHT! / 2 - this.gameOptions.PADDLE_HEIGHT! / 2, this.gameOptions.PADDLE_WIDTH!, this.gameOptions.PADDLE_HEIGHT!);
        this.ball = new Ball(this.gameOptions.CANVAS_WIDTH! / 2 - this.gameOptions.BALL_SIZE! / 2, this.gameOptions.CANVAS_HEIGHT! / 2 - this.gameOptions.BALL_SIZE! / 2, this.gameOptions.BALL_SIZE!);    
        this.bonus = new Bonus(0, 0, this.gameOptions.BONUS_SIZE!);    
	}

	updateGame(data: GameDataUpdate) {
		this.state = data.state!;
		this.player1Score = Number(data.player1?.score);
		this.player2Score = Number(data.player2?.score);
		this.player1.setXY(data.player1?.x, data.player1?.y);
		this.player1.setHeight(data.player1?.height);
		this.player2.setXY(data.player2?.x, data.player2?.y);
		this.player2.setHeight(data.player2?.height);
		this.ball.setXY(data.ball?.x, data.ball?.y);
		this.bonus.setXY(data.bonus?.x, data.bonus?.y);
		this.bonus.setType(data.bonus?.type);
		this.draw();
		if (this.playerSide !== "spectate") {
			if (Game.keysPressed[Keys.W_KEY])
				this.upPressed = true;
			else
				this.upPressed = false;
			if (Game.keysPressed[Keys.S_KEY])
				this.downPressed = true;
			else
				this.downPressed = false;
			this.socket.emit("playerInput", {upPressed: this.upPressed, downPressed: this.downPressed, playerId: this.playerId, uuid: this.uuid})
		}
	}

	draw() {
		this.context.fillStyle = "#000";
		this.context.fillRect(0, 0, this.gameOptions.CANVAS_WIDTH, this.gameOptions.CANVAS_HEIGHT);		
		this.player1.draw(this.context);
		this.player2.draw(this.context);
		this.ball.draw(this.context);
		this.bonus.draw(this.context);
		this.context.fillStyle = "#fff";
		this.context.fillRect(this.gameOptions.CANVAS_WIDTH! / 2 - 1, 0, 3, this.gameOptions.CANVAS_HEIGHT!);
		this.context.font = "40px Avenir";
		this.context.fillText(this.player1Score, 280, 50);
        this.context.fillText(this.player2Score, 390, 50);
	}
}