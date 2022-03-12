import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets"
import { GameService } from "src/game/game.service";
import { Server, Socket } from "socket.io";
import { WebsocketService } from "./websocket.service";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { ChannelService } from "src/chat/channel/channel.service";

@WebSocketGateway( { cors: true } )
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	@WebSocketServer()
	server : Server;

	constructor(
    	private readonly websocketService: WebsocketService,
		private readonly gameService: GameService,
		private readonly usersService: UsersService,
		private readonly channelService: ChannelService,
	) {}

	afterInit(server: Server) {
		this.websocketService.server = server;
	}

	async handleConnection(socket: Socket) {
		const user = await this.usersService.findOne(socket.handshake.auth.userId);
		if (!user) {
			console.log("probleme handle connect");
			this.handleDisconnect(socket);
		}
		else {
			socket.data.user = user;
			socket.data.page = socket.handshake.auth.page;
			//this.websocketService.handleConnectionStatus(socket);
		}
	};

	handleDisconnect(socket: Socket) {
		this.gameService.removeFromQueue(socket.data.user);
		//this.websocketService.handleDisconnectionStatus(socket);
		socket.disconnect();
		// console.log(`${socket.data.user.userName} disconnected`);
	}

	// Match

	@SubscribeMessage('searchGame')
	async searchGame(socket: Socket, payload: any) {
		return this.gameService.searchGame(socket, payload);
	}

	@SubscribeMessage('playerInput')
	async playerInput(socket: Socket, payload: any) {
		return this.gameService.playerInput(payload);
	}
	
	@SubscribeMessage('playerReady')
	async playerReady(socket: Socket, payload: any) {
		return this.gameService.playerReady(socket, payload);
	}

	@SubscribeMessage('playerLeaveMatch')
	async playerLeaveMatch(socket: Socket, payload: any) {
		return this.gameService.playerLeaveMatch(socket, payload);
	}

	@SubscribeMessage('playerLeaveMatchmaking')
	async playerLeaveMatchmaking(socket: Socket) {
		return this.gameService.playerLeaveMatchmaking(socket);
	}
 
	@SubscribeMessage('matchUser')
	async matchUser(socket: Socket, payload: any) {
		return this.gameService.matchUser(socket, payload);
	}

	@SubscribeMessage('findSpectateMatch')
	async findSpectateMatch(socket: Socket, payload: any) {
		return this.gameService.findSpectateMatch(socket, payload);
	}
	// Chat

	@SubscribeMessage('JoinChannel')
	async userJoinChannel(socket: Socket, channelName: string) {
		console.log("SOCKET : CHANNEL : User Join Channel");
		this.channelService.addSocketUser(socket, channelName);
		return this.channelService.refreshChannelMessages(this.server, socket, channelName);
	}

	@SubscribeMessage('sendMessage')
	async userSendMessage(socket: Socket, channelName: string) {
		console.log("SOCKET : CHANNEL : refreshChannelMessages");
		return this.channelService.refreshChannelMessages(this.server, socket, channelName);
	}

	
	@SubscribeMessage('refreshChannelMessages')
	async refreshChannelMessages(socket: Socket, channelName: string) {
		return this.channelService.refreshChannelMessages(this.server, socket, channelName);
	}
	
	@SubscribeMessage('updateChannel')
	async updateChannel(socket: Socket, channelName: string) {
		console.log("SOCKET : CHANNEL : refreshChannelInfos");
		return this.channelService.refreshChannelInfos(this.server, socket, channelName);
	}

	@SubscribeMessage('refreshChannelInfos')
	async refreshChannelInfos(socket: Socket, channelName: string) {
		return this.channelService.refreshChannelInfos(this.server, socket, channelName);
	}
}
