import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserNameDto {
	@IsString()
  @IsNotEmpty()
	newUserName: string;
}