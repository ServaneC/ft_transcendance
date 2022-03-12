import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constants';
import { FortyTwoStrategy } from './Strategy/FortyTwo.strategy';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './Guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TwoFAuthController } from './twoFAuth.controller';
import { twoFAuthService } from './twoFAuth.service';

@Module({
  imports: [ 
    HttpModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5h' },
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    JwtStrategy,
    FortyTwoStrategy,
    twoFAuthService,
  ],
  controllers: [AuthController, TwoFAuthController],
  exports: [AuthService],
})
export class AuthModule {}
