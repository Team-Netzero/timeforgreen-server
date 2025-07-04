import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { CreateMissionDto } from '../mission/dto/create-mission.dto';
import { ReturnMissionDto } from '../mission/dto/return-mission.dto';
import { TransferRoomDto } from '../room/dto/transfer-room.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':username/room')
  async createRoomAndReturnId(
    @Param('username') username: string,
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<string> {
    return await this.userService.createRoom(username, createRoomDto);
  }

  @Post(':username/mission')
  async createMission(
    @Param('username') username: string,
    @Body() createMissionDto: CreateMissionDto,
  ): Promise<void> {
    await this.userService.createMission(username, createMissionDto);

    return;
  }

  @Get(':username/mission/today')
  async getMissionsForToday(
    @Param('username') username: string,
  ): Promise<ReturnMissionDto[]> {
    return await this.userService.getMissionsForToday(username);
  }

  @Get(':username/missions')
  async getMissions(
    @Param('username') username: string,
  ): Promise<ReturnMissionDto[]> {
    return await this.userService.getMissions(username);
  }

  @Get(':username/rooms')
  async getRooms(
    @Param('username') username: string,
  ): Promise<TransferRoomDto[]> {
    return await this.userService.getRooms(username);
  }

  @Delete(':username')
  async remove(
    @Param('username') username: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.userService.remove(username);
    res.cookie('accessToken', '');

    res.send();
    return;
  }
}
