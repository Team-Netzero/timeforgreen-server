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

    res.cookie('accessToken', this.userService.getAccessToken(username), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      path: '/',
    });

    res.send();
  }

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const username = await this.authService.validatePassword(
      req.body.username,
      req.body.password,
    );

    res.cookie('accessToken', this.userService.getAccessToken(username), {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      path: '/',
    });

    await this.userService.updateRefreshToken(username);

    res.send();
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('accessToken', '');

    res.send();
  }
}
