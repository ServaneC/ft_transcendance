import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Channel } from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
	imports: [
		forwardRef(() => TypeOrmModule.forFeature([Channel])),
		forwardRef(() => UsersModule),
		forwardRef(() => WebsocketModule),
	],
	providers: [ ChannelService ],
	controllers: [ ChannelController ],
	exports: [ ChannelService ]
})
export class ChannelModule {}
