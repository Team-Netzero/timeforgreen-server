import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { Request, Response } from 'express';
import { Subject } from 'src/commons/enums/subject';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('search')
  async searchRooms(@Req() req: Request, @Res() res: Response) {
    const rooms = await this.roomService.findBySearch(req.body.search);

    res.json(rooms);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string, @Res() res: Response) {
    res.json(await this.roomService.getRoom(id));
  }

  @Get(':id/missions')
  async getMissions(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const missions = await this.roomService.getMissions(id);

    res.json(missions);
  }

  @Get(':id/users')
  async getUsers(@Param('id') id: string, @Res() res: Response) {
    const users = await this.roomService.getUsers(id);

    res.json(users);
  }

  @Post(':id/user')
  async addUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.roomService.addUser(req.body.username, id);

    res.send();
  }

  @Delete(':id/user')
  async removeUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.roomService.removeUser(req.body.username, id);

    res.send();
  }
}
