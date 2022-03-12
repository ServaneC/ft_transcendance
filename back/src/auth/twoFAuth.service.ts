import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from "@nestjs/config";
import { toFileStream } from 'qrcode';
import { Response } from 'express';
 
@Injectable()
export class twoFAuthService {
  constructor (
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}
 
  public async istwoFAuthCodeValid(twoFAuthCode: string, id: number) {
    const user = await this.usersService.findOne(id);
    return authenticator.verify({
      token: twoFAuthCode,
      secret: user.twoFAuthSecret,
    })
  }

  public async generatetwoFAuthSecret(id: number) {
    const secret = authenticator.generateSecret();
    const user = await this.usersService.findOne(id);
  
    const otpauthUrl = authenticator.keyuri(user.userName, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
 
    await this.usersService.settwoFAuthSecret(secret, user.id);
 
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    stream.setHeader('content-type','image/png');
    return await toFileStream(stream, otpauthUrl);
  }

}