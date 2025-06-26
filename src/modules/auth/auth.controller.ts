import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('join')
  async join(@Req() req: Request, @Res() res: Response) {
    const username = await this.userService.create(req.body.createUserDto);

    await this.userService.updateRefreshToken(username);

    res.json({ accessToken: this.userService.getAccessToken(username) });
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const username = await this.authService.validatePassword(
      req.body.username,
      req.body.password,
    );

    await this.userService.updateRefreshToken(username);

    res.json({ accessToken: this.userService.getAccessToken(username) });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('accessToken', '');

    res.send();
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    res.json({
      accessToken: await this.authService.refresh(req.cookies['accessToken']),
    });
  }
}
