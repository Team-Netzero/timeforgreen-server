import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('join')
  async join(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const user: User = await this.userService.create(createUserDto);

    res.cookie('accessToken', this.userService.getAccessToken(user.username), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      path: '/',
    });

    res.send();
    return;
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const username: string = await this.authService.validatePassword(
      loginUserDto.username,
      loginUserDto.password,
    );

    res.cookie('accessToken', this.userService.getAccessToken(username), {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      path: '/',
    });

    await this.userService.updateRefreshToken(username);

    res.send();
    return;
  }

  @Post('logout')
  logout(@Res() res: Response): void {
    res.cookie('accessToken', '');

    res.send();
    return;
  }
}
