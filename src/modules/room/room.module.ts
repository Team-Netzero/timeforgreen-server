import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoomRelation])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
