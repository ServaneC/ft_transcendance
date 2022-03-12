import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class IdDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}