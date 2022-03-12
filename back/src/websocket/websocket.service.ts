import { Injectable, forwardRef, Inject} from "@nestjs/common";
import { Server, Socket} from "socket.io";

import { Channel } from 'src/chat/channel/channel.entity';
import { UsersService } from "src/users/users.service";
import { GameService } from "src/game/game.service";

@Injectable()
export class WebsocketService {
	server: Server;

	constructor(
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService){}

	async deleteOldSocket(userId: number, page: string) {
		console.log(`socket disconnect all non ${page}`);
		const allSockets = this.server.of('/').sockets as Map<string, Socket>;
    	for (const s of allSockets) {
      		const socket = s[1];
			if (socket.data.user?.id == userId){
				console.log(`socket found for ${userId} : ${socket.data.page}`);
				if (socket.data.page != page) {
					console.log(`socket disconnect for ${socket.data.page} : ${userId}`);
					socket.disconnect();
				}
			}
    	}
		return null;
	}

	async handleConnectionStatus(socket: Socket) {
		await this.usersService.updateLogState(socket.data.user?.id, true);
		await this.usersService.updateGameState(socket.data.user, false);
		console.log("connect status");
	}

	async handleDisconnectionStatus(socket: Socket) {
		await this.usersService.updateLogState(socket.data.user?.id, false);
		await this.usersService.updateGameState(socket.data.user, false);
		console.log("discconnect status");
	}

	async getSocketFromUserId(userId: number, page: string) {
		const allSockets = this.server.of('/').sockets as Map<string, Socket>;
    	for (const s of allSockets) {
      		const socket = s[1];
			if (socket.data.user?.id == userId){
				if (socket.data.page == page)
					return socket;
			}
    	}
		return null;
	}

	async getSocketFromUserIdNoPage(userId: number) {
		const allSockets = this.server.of('/').sockets as Map<string, Socket>;
    	for (const s of allSockets) {
      		const socket = s[1];
			if (socket.data.user?.id == userId){
				return socket;
			}
    	}
		return null;
	}

	async printAllSocketsFromPage(userId: number, page: string) {
		const allSockets = this.server.of('/').sockets as Map<string, Socket>;
    	for (const s of allSockets) {
      		const socket = s[1];
			if (socket.data.user?.id == userId) {
				if (socket.data.page == page)
					console.log(`socket found for ${page} : ${userId}`);
			}
    	}
		return null;
	}

  	////////////////////////////////
	// 			 CHANNEL  		  //
  	////////////////////////////////

	async getSocketsFromChannel(channel: Channel) {
		const allSockets = await this.server.of('/').sockets as Map<string, Socket>;
		let filteredSockets = Array<Socket>();
		for (const s of allSockets) {
			const socket = s[1];
			if (channel.users.find(socket.data.user?.id))
				filteredSockets.push(socket);
		}
		return (filteredSockets);
	}
}
