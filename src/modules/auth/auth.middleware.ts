import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { DecodedToken } from './dto/decoded-token.dto';
import { TransferUserDto } from '../user/dto/transfer-user.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const accessToken: string = req.cookies['accessToken'] as string;
    try {
      this.jwtService.verify(accessToken);
    } catch {
      const decoded: DecodedToken = this.jwtService.decode(accessToken);

      const user: TransferUserDto = await this.userService.findOne(
        decoded.username,
      );
      try {
        await this.jwtService.verify(user.refreshToken!);

        const newAccessToken: string = this.userService.getAccessToken(
          user.username,
        );

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
    return;
  }
}
