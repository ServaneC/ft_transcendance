import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostMatchDto {
    @IsNumber()
    scorePlayerOne: number;

    @IsNumber()
    scorePlayerTwo: number;
}