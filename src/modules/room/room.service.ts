import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Role } from 'src/commons/enums/role';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { TransferRoomDto } from './dto/transfer-room.dto';
import { Mission } from '../mission/mission.entity';
import { ReturnMissionDto } from '../mission/dto/return-mission.dto';
import { User } from '../user/user.entity';
import { ReturnUserDto } from '../user/dto/return-user.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(UserRoomRelation)
    private readonly userRoomRelationRepository: Repository<UserRoomRelation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
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

  async getRoom(roomId: string) {
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) throw new NotFoundException('Room not found');
    return new TransferRoomDto(room);
  }

  async getUsers(roomId: string) {
    const users = await this.userRepository.find({
      where: { userRoomRelations: { room: { id: roomId } } },
      relations: {
        userRoomRelations: true,
      },
    });

    console.log(users);

    const userDtos = await Promise.all(
      users.map(async (user) => {
        const userRoomRelation =
          await this.userRoomRelationRepository.findOneBy({
            user: { username: user.username },
            room: { id: roomId },
          });
        console.log(userRoomRelation);
        const role = userRoomRelation!.role;
        return new ReturnUserDto(user, role);
      }),
    );

    return userDtos;
  }

  async getMissions(roomId: string) {
    const missions = await this.missionRepository.findBy({
      room: { id: roomId },
    });

    return missions.map((mission) => new ReturnMissionDto(mission));
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
