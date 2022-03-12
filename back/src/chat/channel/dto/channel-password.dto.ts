import { IsString } from 'class-validator';

export class ChannelPasswordDto {
	@IsString()
	password: string;
}
