import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const username = await this.authService.validatePassword(
      req.body.username,
      req.body.password,
    );

    const accessToken = this.jwtService.sign(
      { username: username },
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { username: username },
      {
        expiresIn: '7d',
      },
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    res.send();
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('accessToken', '');
    res.cookie('refreshToken', '');

    res.send();
  }
}
