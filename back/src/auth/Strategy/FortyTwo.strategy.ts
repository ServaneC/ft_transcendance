import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/users/user.entity';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, 'passport-42') {
  constructor(private usersService: UsersService,
      private configService: ConfigService,
      private httpService: HttpService) {
    super({
        clientID: configService.get<string>('FORTYTWO_APP_ID'),
        clientSecret:  configService.get<string>('FORTYTWO_APP_SECRET'),
        callbackURL:  "http://localhost:8080/auth/42"
      });
  }

  async validate(accessToken: string): Promise<any> {
    const { data } = await lastValueFrom(this.httpService.get(' https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${ accessToken }` },
      }));
      return await this.usersService.findOrCreate(data.id, data.login);
    }
}