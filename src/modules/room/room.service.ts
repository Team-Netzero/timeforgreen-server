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

  async findBySearch(search: string): Promise<TransferRoomDto[]> {
    const keywords: string[] = search.split(' ');
    const rooms: Room[] = await this.roomRepository.findBy({});
    const roomDtos: TransferRoomDto[] = rooms.map(
      (room) => new TransferRoomDto(room),
    );
    roomDtos.sort(function (a, b) {
      const aCount: number = keywords.filter((keyword) =>
        a.title.includes(keyword),
      ).length;
      const bCount: number = keywords.filter((keyword) =>
        b.title.includes(keyword),
      ).length;

      return bCount - aCount;
    });

    return roomDtos;
  }

  async getRoom(roomId: string): Promise<TransferRoomDto> {
    const room: Room | null = await this.roomRepository.findOneBy({
      id: roomId,
    });
    if (!room) throw new NotFoundException('Room not found');
    return new TransferRoomDto(room);
  }

  async getUsers(roomId: string): Promise<ReturnUserDto[]> {
    const users: User[] = await this.userRepository.find({
      where: { userRoomRelations: { room: { id: roomId } } },
      relations: {
        userRoomRelations: true,
      },
    });

    const userDtos: ReturnUserDto[] = await Promise.all(
      users.map(async (user) => {
        const userRoomRelation: UserRoomRelation | null =
          await this.userRoomRelationRepository.findOneBy({
            user: { username: user.username },
            room: { id: roomId },
          });
        if (!userRoomRelation)
          throw new InternalServerErrorException('Room has no user');
        const role: Role = userRoomRelation.role;
        return new ReturnUserDto(user, role);
      }),
    );

    return userDtos;
  }

  async getMissions(roomId: string): Promise<ReturnMissionDto[]> {
    const missions: Mission[] = await this.missionRepository.findBy({
      room: { id: roomId },
    });

    return missions.map((mission) => new ReturnMissionDto(mission));
  }

  async addUser(username: string, roomId: string): Promise<void> {
    const userRoomRelationInstance: UserRoomRelation =
      this.userRoomRelationRepository.create({
        user: { username: username },
        room: { id: roomId },
        role: Role.PARTICIPANT,
      });

    await this.userRoomRelationRepository.save(userRoomRelationInstance);

    return;
  }

  async removeUser(username: string, roomId: string): Promise<void> {
    await this.userRoomRelationRepository.delete({
      user: { username: username },
      room: { id: roomId },
    });

    return;
  }
}
