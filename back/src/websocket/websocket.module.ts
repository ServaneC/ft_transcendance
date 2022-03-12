import { forwardRef, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { UsersModule } from 'src/users/users.module';
import { GameModule } from 'src/game/game.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/chat/channel/channel.module';

@Module({
    imports: [
        forwardRef(() => ChannelModule),
        forwardRef(() => UsersModule),
        forwardRef(() => GameModule),
        forwardRef(() => AuthModule),
    ],
    providers: [WebsocketGateway, WebsocketService],
    exports: [WebsocketService],
})
export class WebsocketModule {}
