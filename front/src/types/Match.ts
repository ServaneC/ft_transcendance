import { GameState } from './Game';

export default interface Match{
    matchId: number;
	state: GameState;
    playerOne: number;
    playerTwo: number;
    scorePlayerOne: number;
    scorePlayerTwo: number;
}
