import { IsNumber, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsNumber()
    user: number;

    @IsBoolean()
    toAdd: boolean;
}