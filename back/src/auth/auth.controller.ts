import { Get, Controller, Request, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './Guard/FortyTwo-auth.guard';
import { Public } from './utils/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // -> login with 42 api
  @Public()
  @UseGuards(FortyTwoAuthGuard)
  @Get('42')
  async login(@Request() req): Promise<any>  {
    return await this.authService.login(req.user);
  }

  // -> login to user with out 42 (only for testing)
  @Public()
  @Get(':id')
  async loginInvite(@Param('id') id: number): Promise<any>  {
    return await this.authService.loginInvite(id);
  }
}
