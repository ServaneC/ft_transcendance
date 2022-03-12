import {
    Controller,
    Post,
    Res,
    Body,
    HttpCode,
    BadRequestException,
  } from '@nestjs/common';
  import { twoFAuthService } from './twoFAuth.service';
  import { Response } from 'express';
import { Public } from './utils/public.decorator';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthDto } from 'src/users/dto/TwoFAuth-code.dto';
import { AuthService } from './auth.service';

  @Controller('2fa')
  export class TwoFAuthController {
    constructor(
      private readonly twoFAuthService: twoFAuthService,
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
    ) {}
   
    // -> turn on 2fa
    @Post('turn-on')
    @HttpCode(200)
    async turnOnTwoFAuth(
      @Body() twoFAuthData : TwoFactorAuthDto,
    ) {
      const isCodeValid = await this.twoFAuthService.istwoFAuthCodeValid(
        twoFAuthData.twoFAuthCode, twoFAuthData.id
      );
      if (!isCodeValid) {
        throw new BadRequestException("Wrong authentication code");
      }
      await this.usersService.turnOnTwoFAuth(twoFAuthData.id);
    }

    // -> generate qr code 
    @Post('generate')
    async register(@Res() response: Response, @Body() id: number) {
      const { otpauthUrl } = await this.twoFAuthService.generatetwoFAuthSecret(id);
   
      return await this.twoFAuthService.pipeQrCodeStream(response, otpauthUrl);
    }

    // -> turn off 2fa
    @Post('turn-off')
    async turnOffTwoFAuth(@Body() id: number) {
      return await this.usersService.turnOffTwoFAuth(id);
    }

    // -> authenticate an user with 2fa turned on
    @Public()
    @Post('authenticate')
    @HttpCode(200)
    async authenticate(
      @Body() twoFAuthInfo : TwoFactorAuthDto
    ) {
      const isCodeValid = await this.twoFAuthService.istwoFAuthCodeValid(
        twoFAuthInfo.twoFAuthCode, twoFAuthInfo.id
      );
      if (!isCodeValid) {
        throw new BadRequestException('Wrong authentication code');
      }
      const user = await this.usersService.findOne(twoFAuthInfo.id);
      return await this.authService.loginAuthenticate(user);
    }
  }