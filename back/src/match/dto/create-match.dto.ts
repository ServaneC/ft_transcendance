import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatchDto {
    @IsNumber()
    @IsNotEmpty()
    playerOne: number;

    @IsNumber()
    @IsNotEmpty()
    playerTwo: number;
}