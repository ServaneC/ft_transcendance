import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MulterModule } from '@nestjs/platform-express';
import { JwtStrategy } from 'src/auth/Strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/utils/constants';
import { MatchModule } from 'src/match/match.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  MulterModule.registerAsync({
    useFactory: () => ({
      dest: './upload',
    }),
  }),
  JwtModule.register({
	secret: jwtConstants.secret,
	signOptions: { expiresIn: '5h' },
  }),
  forwardRef(() => MatchModule),
  ],
  providers: [
	UsersService,
	JwtStrategy,
	],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}