import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('mission')
  async createMission(@Req() req: Request, @Res() res: Response) {
    await this.userService.createMission(
      req.body.username,
      req.body.createMissionDto,
    );

    res.send();
  }

  @Get('missions')
  async getMissions(@Req() req: Request, @Res() res: Response) {
    const missionCounts = await this.userService.getMissions(req.body.username);

    res.json(missionCounts);
  }

  @Delete()
  async remove(@Req() req: Request, @Res() res: Response) {
    await this.userService.remove(req.body.username);
    res.cookie('accessToken', '');

    res.send();
  }
}
