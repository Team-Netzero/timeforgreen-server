import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':username/room')
  async createRoom(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const roomId = await this.userService.createRoom(
      username,
      req.body.createRoomDto,
    );

    res.json({ roomId: roomId });
  }

  @Post(':username/mission')
  async createMission(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.userService.createMission(username, req.body.createMissionDto);

    res.send();
  }

  @Get(':username/missions')
  async getMissions(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const missions = await this.userService.getMissions(username);

    res.json(missions);
  }

  @Get(':username/rooms')
  async getRooms(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const rooms = await this.userService.getRooms(username);

    res.json(rooms);
  }

  @Delete(':username')
  async remove(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.userService.remove(username);
    res.cookie('accessToken', '');

    res.send();
  }
}
