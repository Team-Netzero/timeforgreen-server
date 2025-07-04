import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { TransferRoomDto } from './dto/transfer-room.dto';
import { ReturnMissionDto } from '../mission/dto/return-mission.dto';
import { ReturnUserDto } from '../user/dto/return-user.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('search')
  async searchRooms(
    @Body('search') search: string,
  ): Promise<TransferRoomDto[]> {
    return await this.roomService.findBySearch(search);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string): Promise<TransferRoomDto> {
    return await this.roomService.getRoom(id);
  }

  @Get(':id/missions')
  async getMissions(@Param('id') id: string): Promise<ReturnMissionDto[]> {
    return await this.roomService.getMissions(id);
  }

  @Get(':id/users')
  async getUsers(@Param('id') id: string): Promise<ReturnUserDto[]> {
    return await this.roomService.getUsers(id);
  }

  @Post(':id/user')
  async addUser(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<void> {
    await this.roomService.addUser(username, id);

    return;
  }

  @Delete(':id/user')
  async removeUser(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<void> {
    await this.roomService.removeUser(username, id);

    return;
  }
}
