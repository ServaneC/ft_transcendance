import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateChannelDto {
	@IsString()
	@IsNotEmpty()
	channelName: string;

	@IsString()
	password: string;

	@IsBoolean()
	isPublic: boolean;

	@IsNumber()
	owner: number;
}
