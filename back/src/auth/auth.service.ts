import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async login(data: any) {
    if (data.user.isPermaBan == true)
      return {
        message: 'You are banned from this site'
      };
    if (data.user.isTwoFAuthEnabled)
      return {
        id: data.user.id,
      };
    const payload = { name: data.user.userName, sub: data.user.id };
    await this.usersService.updateLogState(data.user.id, true);
    return {
      access_token: this.jwtService.sign(payload),
      userName: data.user.userName,
      id: data.user.id,
      isCreated: data.isCreated,
    };
  }

  async loginAuthenticate(user: User) {
    await this.usersService.updateLogState(user.id, true);
    const payload = { name: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userName: user.userName,
      id: user.id,
      isCreated: false,
    };
  }

  async loginInvite(id: number) {
    const user = await this.usersService.findOne(id);
    this.usersService.updateLogState(id, true);
    const payload = { name: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      userName: user.userName,
      id: user.id,
      isCreated: false,
    };
  }
}
