import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Role } from 'src/commons/enums/role';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { TransferRoomDto } from './dto/transfer-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(UserRoomRelation)
    private readonly userRoomRelationRepository: Repository<UserRoomRelation>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async findBySearch(search: string) {
    const keywords = search.split(' ');
    const rooms = await this.roomRepository.findBy({});
    const roomDtos = rooms.map((room) => new TransferRoomDto(room));
    roomDtos.sort(function (a, b) {
      const aCount = keywords.filter((keyword) =>
        a.title.includes(keyword),
      ).length;
      const bCount = keywords.filter((keyword) =>
        b.title.includes(keyword),
      ).length;

      return bCount - aCount;
    });

    return roomDtos;
  }

  async addUser(username: string, roomId: string) {
    const userRoomRelationInstance = this.userRoomRelationRepository.create({
      user: { username: username },
      room: { id: roomId },
      role: Role.PARTICIPANT,
    });

    const userRoomRelation = await this.userRoomRelationRepository.save(
      userRoomRelationInstance,
    );
    if (!userRoomRelation)
      throw new InternalServerErrorException(
        'Adding user failed due to unknown error',
      );

    return;
  }

  async removeUser(username: string, roomId: string) {
    await this.userRoomRelationRepository.delete({
      user: { username: username },
      room: { id: roomId },
    });

    return;
  }
}
