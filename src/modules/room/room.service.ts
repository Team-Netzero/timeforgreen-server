import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Role } from 'src/commons/enums/role';

@Injectable()
export class RoomService {
  constructor(
    private readonly userRoomRelationRepository: Repository<UserRoomRelation>,
  ) {}

  // async findByKeywords()

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
