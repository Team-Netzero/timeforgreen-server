import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validatePassword(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!(await bcrypt.compare(password, user.hashedPassword)))
      throw new UnauthorizedException('Invalid password');

    return user.username;
  }
}
