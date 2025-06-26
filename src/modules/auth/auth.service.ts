import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async refresh(accessToken: string) {
    const decoded = this.jwtService.decode(accessToken);
    const user = await this.userService.findOne(decoded.username);
    try {
      await this.jwtService.verify(user.refreshToken!);
    } catch {
      throw new UnauthorizedException('Refresh token expired or never existed');
    }

    const newAccessToken = this.userService.getAccessToken(decoded.username);
    return newAccessToken;
  }

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!(await bcrypt.compare(password, user.hashedPassword)))
      throw new UnauthorizedException('Invalid password');

    return user.username;
  }
}
