import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
    @IsNumber()
    owner: number;

    @IsString()
    @IsNotEmpty()
    message: string;
}