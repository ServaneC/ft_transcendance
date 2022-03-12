import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum GameState {
  WAITING_ALL,
  IN_PROGRESS,
  FINISHED,
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  matchId: string;

  @Column({ enum: GameState, default: GameState.WAITING_ALL })
  state: GameState;

  @Column("int")
  playerOne: number;

  @Column("int")
  playerTwo: number;

  @Column("int", {nullable: true, default : 0})
  scorePlayerOne: number;

  @Column("int", {nullable: true, default : 0})
  scorePlayerTwo: number;
}