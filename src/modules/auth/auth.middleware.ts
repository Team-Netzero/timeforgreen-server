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
      req.body.id = payload.username;
    } catch {
      const decoded = this.jwtService.decode(req.cookies['accessToken']);

      const user = await this.userService.findOne(decoded.username);
      try {
        await this.jwtService.verify(user.refreshToken!);

        const newAccessToken = this.jwtService.sign(user.username);
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 1000 * 60 * 60 * 7,
        });

        req.body.username = decoded.username;
      } catch {
        throw new UnauthorizedException('Refresh token expired');
      }
      next();
    }
  }
}
