import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Room } from './room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoomRelation, Room])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
