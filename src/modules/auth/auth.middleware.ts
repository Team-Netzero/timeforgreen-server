import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = this.jwtService.verify(req.cookies['accessToken']);
      console.log(payload);
    } catch (e) {
      console.log(e);
      const decoded = this.jwtService.decode(req.cookies['accessToken']);

      const user = await this.userService.findOne(decoded.username);
      try {
        await this.jwtService.verify(user.refreshToken!);

        const newAccessToken = this.userService.getAccessToken(user.username);
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
          path: '/',
        });
      } catch {
        throw new UnauthorizedException('Refresh token expired');
      }
    }
    next();
  }
}
