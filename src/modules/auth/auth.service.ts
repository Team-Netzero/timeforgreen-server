import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TransferUserDto } from '../user/dto/transfer-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validatePassword(username: string, password: string): Promise<string> {
    const user: TransferUserDto = await this.userService.findOne(username);
    if (!(await bcrypt.compare(password, user.hashedPassword)))
      throw new UnauthorizedException('Invalid password');

    return user.username;
  }
}
