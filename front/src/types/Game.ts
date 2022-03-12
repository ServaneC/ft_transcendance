export enum GameState {
	WAITING_ALL,
	IN_PROGRESS,
	FINISHED,
}

export enum BonusType {
	NONE = 0,
	SPEED,
	PLUS,
	MINUS,
	REFLECT
}

export class GameOptionsInterface {
	FPS: number | undefined
	CANVAS_WIDTH: number | undefined
	CANVAS_HEIGHT: number | undefined
	PADDLE_WIDTH: number | undefined
	PADDLE_HEIGHT: number | undefined
	PADDLE_MARGIN: number | undefined
	BALL_SIZE: number | undefined
	BONUS_SIZE: number | undefined
};


export class GameDataUpdate {
	state: GameState | undefined
	ball: {
		x: number
		y: number
	} | undefined
	player1: {
		x: number
		y: number
		height: number
		score: number
	} | undefined
	player2: {
		x: number
		y: number
		height: number
		score: number
	} | undefined
	bonus: {
		type: number
		x: number
		y: number
	} | undefined
}
