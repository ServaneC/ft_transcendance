import { forwardRef, Inject, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from '../../users/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsAndOwnersDto } from './dto/channels-and-owners';
import { UsersService } from 'src/users/users.service';
import { enumAchievements} from 'src/achievements/achievements';
import { Socket, Server } from "socket.io";
import { WebsocketService } from "src/websocket/websocket.service";
import * as bcrypt from 'bcrypt';
import { match } from 'assert';

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(forwardRef(() => WebsocketService))
		private readonly socketService: WebsocketService,
	) {}

	async create(createChannelDto: CreateChannelDto): Promise <Channel> {
		const channel = new Channel();
		channel.channelName = createChannelDto.channelName;
		if (createChannelDto.password && createChannelDto.password != undefined)
			channel.password = createChannelDto.password;
		channel.isPublic = createChannelDto.isPublic;
		channel.isProtected = false;
		if (channel.password && channel.password != undefined)
			channel.isProtected = true;
		channel.owner = createChannelDto.owner;
		channel.messagesHistory = [];
		channel.admins = [createChannelDto.owner];
		channel.users = [createChannelDto.owner];
		channel.banList = [];
		channel.muteList = [];
		channel.kickList = [];
		if (channel.isPublic)
			await this.usersService.setAchievementAsync(createChannelDto.owner, enumAchievements.CREATE_PUBLIC_CHANNEL)
		else
			await this.usersService.setAchievementAsync(createChannelDto.owner, enumAchievements.CREATE_PRIVATE_CHANNEL)
		return (await this.channelRepository.save(channel));
	}

	/////////////////////////////////////////
  	//  Recherche et gestion des channels  //
  	/////////////////////////////////////////

	async findOne(channelName: string) : Promise<Channel> {
		return (await this.channelRepository.findOne(channelName));
	}
	async findAll() : Promise<Channel[]> {
		return (await this.channelRepository.find());
	}
	async findAllPublicChannels() : Promise<ChannelsAndOwnersDto> {
		const channels = await this.channelRepository.find({isPublic: true});
		let usersIds: number[] = [];
		channels.forEach((channel: Channel) => usersIds.push(channel.owner));
		const owners = await this.usersService.getUsersInTab(usersIds);
		return {
			channels: channels,
			owners: owners,
		};
	}

	async findAllUserChannels(userId: number): Promise<ChannelsAndOwnersDto> {
		const channels = await this.channelRepository.find();
		let mychannels: Channel[] = [];
		let usersIds: number[] = [];
		channels.forEach((chan) => {
			for (let i = 0; i < chan.users.length; i++) {
				if (chan.users[i] == userId) {
					mychannels.push(chan);
					break ; 
				}
			}
		});
		mychannels.forEach((channel) => usersIds.push(channel.owner));
		const owners = await this.usersService.getUsersInTab(usersIds);
		return {
			channels: mychannels,
			owners: owners,
		};
	}

	async findAllPrivateChannels() : Promise<Channel[]> {
		return (await this.channelRepository.find({isPublic: false}));
	}
	async channelAlreadyExists(channelName: string): Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel)
			return (true);
		return (false);
	}
	async findUserInChannel(channelName: string, userID: number) : Promise<boolean> {
		const channel = await this.findOne(channelName);
		if (channel.users.indexOf(userID) !== -1) {
			let index = channel.users.indexOf(userID);
			if (index !== -1) {
				channel.kickList.splice(index, 1);
			}
			return (true);
		}
		return (false);
	}

	async userIsAuthorized(channelName: string, userId: number) : Promise<boolean> {
		const channel = await this.findOne(channelName);
		if (channel.users.indexOf(userId) == -1)
			return (false);
		if (channel.muteList.indexOf(userId) != -1)
			return (false);
		return (true);
	}

	async userIsBan(channelName: string, userId: number) : Promise<boolean> {
		const channel = await this.findOne(channelName);
		if (channel && channel.banList.indexOf(userId) != -1)
			return (true);
		return (false);
	}

	/////////////////////////////////////////
	//  Gestion des listes d'utilisateurs  //
  /////////////////////////////////////////

	async getUsersinChannel(channelName: string): Promise<User[]> {
		const channel = await this.channelRepository.findOne(channelName);
		const users = await this.usersService.getUsersInTab(channel.users);
		return await users.filter((user) => channel.banList.indexOf(user.id) == -1 && channel.kickList.indexOf(user.id) == -1 );
	}

	async getBanListChannel(channelName: string): Promise<User[]> {
		const channel = await this.channelRepository.findOne(channelName);
		return this.usersService.getUsersInTab(channel.banList);
	}

	async addUserAsUser(channelName: string, userId: number) : Promise<void> {
		const channel = await this.channelRepository.findOne(channelName);
		channel.users.push(userId);
		await this.channelRepository.save(channel);
	}

	async userLeftChannel(channelName: string, userId: number) {
		const channel = await this.channelRepository.findOne(channelName);
		let index = channel.users.indexOf(userId);
		if (index != -1) {
			channel.users.splice(index, 1);
			index = channel.kickList.indexOf(userId);
			if (index != -1) {
				channel.kickList.splice(index, 1);
			}
			index = channel.admins.indexOf(userId);
			if (index != -1) {
				channel.admins.splice(index, 1);
			}
			if (channel.owner == userId) {
				channel.owner = null;
			}
			await this.channelRepository.save(channel);
		}
	}

	async addUserAsAdmin(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.admins.indexOf(userId) == -1) {
			channel.admins.push(userId);
			return await this.channelRepository.save(channel);
		}
		return ;
	}

	async addUserAsOwner(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (!channel.owner) {
			channel.owner = userId;
			if (channel.admins.indexOf(userId) == -1)
				channel.admins.push(userId);
			return await this.channelRepository.save(channel);
		}
		return ;
	}

	async addUserAsMuted(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.muteList.indexOf(userId) == -1 && channel.owner != userId) {
			channel.muteList.push(userId);
			return await this.channelRepository.save(channel);
		}
	}
	async addUserAsBanned(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.banList.indexOf(userId) == -1 && channel.owner != userId) {
			channel.banList.push(userId);
			return await this.channelRepository.save(channel);
		}
	}

	async addUserAsKicked(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.kickList.indexOf(userId) == -1 && channel.owner != userId) {
			channel.kickList.push(userId);
			return await this.channelRepository.save(channel);
		}
	}

	// Retrait
	async removeUserAsUser(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		channel.users.splice(channel.users.indexOf(userId));
		return await this.channelRepository.save(channel);
	}

	async removeUserAsAdmin(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.admins.indexOf(userId) != -1) {
			channel.admins.splice(channel.admins.indexOf(userId), 1);
			return await this.channelRepository.save(channel);
		}
	}

	async removeUserAsOwner(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		channel.owner = null;
		if (channel.admins.indexOf(userId) != -1) 
			channel.admins.splice(channel.admins.indexOf(userId), 1);
		return await this.channelRepository.save(channel);
	}

	async removeUserAsMuted(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.muteList.indexOf(userId) != -1) {
			channel.muteList.splice(channel.muteList.indexOf(userId), 1);
			return await this.channelRepository.save(channel);
		}
	}
	async removeUserAsBanned(channelName: string, userId: number) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel.banList.indexOf(userId) != -1) {
			channel.banList.splice(channel.banList.indexOf(userId), 1);
			return await this.channelRepository.save(channel);
		}
	}
	
	//////////////////////////
	//  Gestion du password //
	//////////////////////////

	async updatePassword(channelName: string, password: string, newPassword: string): Promise<Channel> {
		const channel = await this.channelRepository.findOne(channelName);
		let matching: boolean = true;
		if (channel.isProtected)
			matching = await this.passwordMatch(channelName, password);
		if (!matching)
			throw new BadRequestException("Password doesn't match");
		if (matching && newPassword && newPassword != undefined) {
			return await this.channelRepository.save({
				channelName: channelName,
				isProtected: true,
				password: await bcrypt.hash(newPassword, 10),
			});
		}
		return await this.channelRepository.findOne(channelName);
	}

	async removePassword(channelName: string, password: string): Promise<Channel> {
		const match = await this.passwordMatch(channelName, password);
		if (match) {
			return await this.channelRepository.save({
			channelName: channelName,
			isProtected: false,
			password: null,
			});
		}
		return await this.channelRepository.findOne(channelName);
	}

	////////////////////////////////
	//  Gestion de l'historique   //
	////////////////////////////////

	async addMessageToHistory(channelName: string, messageId: number) : Promise<void> {
		const channel = await this.channelRepository.findOne(channelName);
		channel.messagesHistory.push(messageId);
		await this.channelRepository.save(channel);
	}

	async getMessageHistory(channelName: string) : Promise<number[]> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel != undefined)
			return (channel.messagesHistory);
	}

  	////////////////////////////////
	//  DESTRUCTION DES CHANNELS  //
  	////////////////////////////////

	async deleteOne(channelName : string) : Promise<any> {
		const channel = await this.channelRepository.findOne(channelName);
		this.channelRepository.delete(channel);
		if (!channel)
			return (true);
		return (false);
	}

  	////////////////////////////////
	//  	  JOIN CHANNEL 	 	  //
  	////////////////////////////////

	async hasPassword(channelName: string) : Promise<boolean> {
		const channel = await this.channelRepository.findOne(channelName);
		if (channel)
			return (channel.isProtected);
		return (false);
	}

	async passwordMatch(channelName: string, password: string) : Promise<boolean> {
		const channel = await this.channelRepository.findOne(channelName);
		console.log("my password = ", password);
		if (!channel)
			return (false);
		else if (!channel.password)
			return (true);
		else if (!password || password == undefined)
			return (false);
		else if (await bcrypt.compare(password, channel.password) == true)
			return (true);
		return (false);
	}
	

  	////////////////////////////////
	// 			 SOCKETS  		  //
  	////////////////////////////////

	// todo
	//
	// - add socket user when connected to channel
	// - destory socket user when disconnect to channel
	// - join socket user


	//userSockets: Socket = new Map<Socket, string>();

	async addSocketUser(socket: Socket, channelName: string) {
		//if (this.userSockets.has(socket)) {
		//	console.log("SOCKET : User Already in channel !");
		//} else {
		//	console.log("SOCKET : User Join Channel");
		//	this.userSockets.set(socket, channelName);
		//}

	//	if (this.userSockets.indexOf(socket) == -1) {
		//	this.userSockets.push(socket);
		//	console.log("SOCKET : User Join Channel");
		//}
		//else
		//	console.log("SOCKET : User Already in channel !");
	}

	//	async get

	async refreshChannelMessages(server: Server, socket: Socket, channelName: string) : Promise<any> {
		const allUsers = (await this.findOne(channelName)).users as Array<number>;

		server.to(channelName).emit('refreshChannelMessages');

		for (let index = 0; index < allUsers.length; index++) {
			const element = allUsers[index];
			console.log("User: " + element);
			const currentSocket = await this.socketService.getSocketFromUserId(element, 'channel');
			if (currentSocket) {
				console.log("Socket send to user: " + element);
				currentSocket.emit('refreshChannelMessages');
			} else {
				console.log("socket: for ID : " + element + " is null");
			}
		}
		return (true);
	}

	async refreshChannelInfos(server: Server, socket: Socket, channelName: string) : Promise<any> {
		const allUsers = (await this.findOne(channelName)).users as Array<number>;

		server.to(channelName).emit('refreshChannelInfo');

		for (let index = 0; index < allUsers.length; index++) {
			const element = allUsers[index];
			console.log("User: " + element);
			const currentSocket = await this.socketService.getSocketFromUserId(element, 'channel');
			if (currentSocket) {
				console.log("Socket send to user: " + element);
				currentSocket.emit('refreshChannelInfo');
			} else {
				console.log("socket: for ID : " + element + " is null");
			}
		}
		return (true);
	}
}
