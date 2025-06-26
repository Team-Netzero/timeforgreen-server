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
  /*
  @Get('search')
  async searchRooms(@Req() req: Request, @Res() res: Response) {
    return await this.roomService.findByKeywords(req.body.searchParam)
  }
    */

  @Post('user')
  async addUser(@Req() req: Request, @Res() res: Response) {
    await this.roomService.addUser(req.body.username, req.body.roomId);

    res.send();
  }

  @Delete('user')
  async removeUser(@Req() req: Request, @Res() res: Response) {
    await this.roomService.removeUser(req.body.username, req.body.roomId);

    res.send();
  }
}
