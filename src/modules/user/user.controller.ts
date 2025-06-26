import { Controller, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async remove(@Req() req: Request, @Res() res: Response) {
    await this.userService.remove(req.body.username);
    res.cookie('accessToken', '');

    res.send();
  }
}
