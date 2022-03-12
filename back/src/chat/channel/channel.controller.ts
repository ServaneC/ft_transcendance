import { Body, Controller, Get, Post, Delete, Param, Res} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/utils/public.decorator';

import { ChannelService } from './channel.service';
import { Channel } from './channel.entity'
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChannelPasswordDto } from './dto/channel-password.dto';
import { ChannelsAndOwnersDto } from './dto/channels-and-owners';
import { User } from 'src/users/user.entity';
import { IdDto } from 'src/users/dto/id.dto';
import { UpdatePasswordDto } from 'src/chat/channel/dto/update-password.dto';
import { channel } from 'diagnostics_channel';
import { catchError } from 'rxjs';

@Controller('channel')
export class ChannelController {
	constructor(
		private readonly channelService: ChannelService,
	) {}

	// ------ //
	//  POST  //
	// ------ //

	// @Public()
	@Post('createChannel')
	async createChannel(@Res() res, @Body() createChannelDto: CreateChannelDto) {
		if (await this.channelService.channelAlreadyExists(createChannelDto.channelName)) {
			return res.status(HttpStatus.CONFLICT).json({
				message: "Channel already exists"
			})
		}
		const channel = await this.channelService.create(createChannelDto);
		return res.status(HttpStatus.CREATED).json({
			message: "Channel has been created successfully",
			channel
		})
	}

	// @Public()
	@Post('join-channel/:channelName')
	async canJoinChannel(@Res() res, @Param('channelName') channelName: string, @Body() channelPasswordDto: ChannelPasswordDto) : Promise<any> {
		if (!await this.channelService.findOne(channelName)) {
			return res.status(HttpStatus.NOT_FOUND).json({
				message: "Channel doesn't exist",
			})
		}
		else if (await this.channelService.hasPassword(channelName) == false
		|| await this.channelService.passwordMatch(channelName, channelPasswordDto.password) == true) {
			return res.status(HttpStatus.OK).json({
				message: "Can join channel",
			})
		}
		else {
			return res.status(HttpStatus.CONFLICT).json({
				message: "Password does not match",
			})
		}
	}

	@Post('/admin/:channelName')
	async updateChannelAdmin(@Res() res, @Param('channelName') channelName: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		if (updateUserDto.toAdd) {
			await this.channelService.addUserAsAdmin(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User added to admins"
			})
		}
		else {
			await this.channelService.removeUserAsAdmin(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User removed from admins"
			})
		}
	}

	@Post('/owner/:channelName')
	async updateChannelOwner(@Res() res, @Param('channelName') channelName: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		if (updateUserDto.toAdd) {
			await this.channelService.addUserAsOwner(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User added as Owner"
			})
		}
		else {
			await this.channelService.removeUserAsOwner(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User removed as Owner"
			})
		}
	}


	@Post('/mute/:channelName')
	async updateChannelMuteList(@Res() res, @Param('channelName') channelName: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		if (updateUserDto.toAdd) {
			await this.channelService.addUserAsMuted(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User added to muted"
			})
		}
		else {
			await this.channelService.removeUserAsMuted(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User removed from muted"
			})
		}
	}
	@Post('/ban/:channelName')
	async updateChannelBanList(@Res() res, @Param('channelName') channelName: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		if (updateUserDto.toAdd) {
			await this.channelService.addUserAsBanned(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User added to banned"
			})
		}
		else {
			await this.channelService.removeUserAsBanned(channelName, updateUserDto.user);
			return res.status(HttpStatus.OK).json({
				message: "User removed from banned"
			})
		}
	}

	@Post('/kick/:channelName')
	async addUserAsKicked(@Res() res, @Param('channelName') channelName: string, @Body() idDto: IdDto): Promise<any> {
		await this.channelService.addUserAsKicked(channelName, idDto.id);
		return res.status(HttpStatus.OK).json({
			message: "User has been kikcked"
		})
	}

	@Post('/password/:channelName')
	async updateChannelPassword(@Res() res, @Param('channelName') channelName: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<any> {
		if (updatePasswordDto.toAdd) {
			try {
				const channel = await this.channelService.updatePassword(channelName, updatePasswordDto.currentPassword, updatePasswordDto.newPassword);
				return res.status(HttpStatus.OK).json({
					message: "Password updated",
					channel: channel,
				})
			}
			catch (error: any) {
				return res.status(error.response.statusCode).json({
					message: error.response.message,
				})				
			}
			
		}
		else {
			const channel = await this.channelService.removePassword(channelName, updatePasswordDto.currentPassword);
			return res.status(HttpStatus.OK).json({
				message: "Password removed from Channel",
				channel: channel,
			})
		}
	}

	// @Public()
	@Post('/update-user/:channelName')
	async addChannelUser(@Res() res, @Param('channelName') channelName: string, @Body() updateUserDto: UpdateUserDto) :Promise<void> {
		if (await this.channelService.findUserInChannel(channelName, updateUserDto.user)) {
			if (!updateUserDto.toAdd) {
				await this.channelService.userLeftChannel(channelName, updateUserDto.user);
				return res.status(HttpStatus.OK).json({
					message: "User removed from channel"
				})
			}
			return res.status(HttpStatus.OK).json({
				message: "User already in channel"
			})
		}
		else if (updateUserDto.toAdd) {
			this.channelService.addUserAsUser(channelName, updateUserDto.user);
			return (
				res.status(HttpStatus.CREATED).json ({
					message: `"User successfully added to channel !" + "channelName"`
				})
				);
			}
	}

  // ------ //
  //  GET   //
  // ------ //
	// @Public()
	@Get()
	async findAllChannels() : Promise<Channel[]> {
	  return (await this.channelService.findAll());
	}
	// @Public()
	@Get('public')
	async findAllPublicChannels(): Promise<ChannelsAndOwnersDto> {
	  return (await this.channelService.findAllPublicChannels());
	}

	// @Public()
	@Get('user/:userId')
	async findAllUserChannels(@Param('userId') userId: number): Promise<ChannelsAndOwnersDto> {
	  return (await this.channelService.findAllUserChannels(userId));
	}

	// @Public()
	@Get('infos/:channelName')
	async getChannelInfos(@Res() res, @Param('channelName') channelName: string) : Promise<any> {
		const channel = await this.channelService.findOne(channelName);
		if (channel) {
			return res.status(HttpStatus.OK).json({
				message: "Channel found",
				channel: channel,
			})
		}
		else {
			return res.status(HttpStatus.NOT_FOUND).json({
				message: "Channel doesn't exist",
				channel: channel,
			})
		}
	}

	@Get('users/:channelName')
	async getUsersinChannel(@Param('channelName') channelName: string) : Promise<any> {
		const channel = await this.channelService.findOne(channelName);
		if (channel)
			return (await this.channelService.getUsersinChannel(channelName));
	}

	// @Public()
	@Get('messagesHistory/:channelName')
	getChannelHistory(@Param('channelName') channelName: string) : Promise<number[]> {
		return (this.channelService.getMessageHistory(channelName));
	}

	// @Public()
	@Get('channel-exist/:channelName')
	async channelExist(@Param('channelName') channelName: string) : Promise<any> {
		if (await this.channelService.findOne(channelName))
			return (true);
		return (false);
	}

	@Get('banlist/:channelName')
	async getBanList(@Param('channelName') channelName: string) : Promise<any> {
		const channel = await this.channelService.findOne(channelName);
		if (channel)
			return (this.channelService.getBanListChannel(channelName));
	}


	// ------- //
	//  DELETE //
	// ------- //

	// @Public()
	@Delete(':channelName')
	async deleteChannel(@Param('channelName') channelName : string) {
		await this.channelService.deleteOne(channelName);
		return ("successfully deleted");
	}

}
