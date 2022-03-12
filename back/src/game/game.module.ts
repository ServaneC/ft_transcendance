import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { UsersModule } from 'src/users/users.module';
import { MatchModule } from 'src/match/match.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/match/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    forwardRef(() => WebsocketModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MatchModule),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
