import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Between, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { TransferUserDto } from './dto/transfer-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Mission } from '../mission/mission.entity';
import { ReturnMissionDto } from '../mission/dto/return-mission.dto';
import { CreateMissionDto } from '../mission/dto/create-mission.dto';
import { Room } from '../room/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferRoomDto } from '../room/dto/transfer-room.dto';
import { CreateRoomDto } from '../room/dto/create-room.dto';
import { Role } from 'src/commons/enums/role';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(UserRoomRelation)
    private readonly userRoomRelationRepository: Repository<UserRoomRelation>,

    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      await this.userRepository.existsBy({ username: createUserDto.username })
    )
      throw new UnprocessableEntityException('Username already exists');

    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const refreshToken: string = this.jwtService.sign(
      { username: createUserDto.username },
      {
        expiresIn: '7d',
      },
    );

    const userInstance: User = this.userRepository.create({
      username: createUserDto.username,
      hashedPassword: hashedPassword,
      refreshToken: refreshToken,
    });

    const user: User = await this.userRepository.save(userInstance);

    return user;
  }

  async createRoom(
    username: string,
    createRoomDto: CreateRoomDto,
  ): Promise<string> {
    if (!(await this.userRepository.existsBy({ username: username })))
      throw new NotFoundException('User not exist');

    const roomInstance: Room = this.roomRepository.create({
      title: createRoomDto.title,
      activated: true,
      allowNotificationAt: createRoomDto.allowNotificationAt,
    });

    const room: Room = await this.roomRepository.save(roomInstance);

    const userRoomRelationInstance: UserRoomRelation =
      this.userRoomRelationRepository.create({
        user: { username: username },
        room: { id: room.id },
        role: Role.HOST,
      });

    const userRoomRelation: UserRoomRelation =
      await this.userRoomRelationRepository.save(userRoomRelationInstance);
    if (!userRoomRelation)
      throw new InternalServerErrorException(
        'Creating room relation failed due to unknown error',
      );
    return room.id;
  }

  async createMission(
    username: string,
    createMissionDto: CreateMissionDto,
  ): Promise<void> {
    const user: User | null = await this.userRepository.findOneBy({
      username: username,
    });
    if (!user) throw new NotFoundException('User not found');

    const room: Room | null = await this.roomRepository.findOneBy({
      id: createMissionDto.roomId,
    });
    if (!room) throw new NotFoundException('Room not found');

    const missionInstance: Mission = this.missionRepository.create({
      subject: createMissionDto.subject,
      user: user,
      room: room,
    });

    await this.missionRepository.save(missionInstance);

    return;
  }

  async findOne(username: string): Promise<TransferUserDto> {
    const user: User | null = await this.userRepository.findOneBy({
      username: username,
    });
    if (!user) throw new NotFoundException('User not found');
    return new TransferUserDto(user);
  }

  async getMissions(username: string): Promise<ReturnMissionDto[]> {
    const missions: Mission[] = await this.missionRepository.find({
      where: { user: { username: username } },
      relations: { room: true },
    });
    return missions.map((mission) => {
      return new ReturnMissionDto(mission);
    });
  }

  async getMissionsForToday(username: string): Promise<ReturnMissionDto[]> {
    const missions: Mission[] = await this.missionRepository.find({
      where: {
        user: { username: username },
        createdAt: Between(startOfDay(new Date()), endOfDay(new Date())),
      },
      relations: { room: true },
    });

    return missions.map((mission) => {
      return new ReturnMissionDto(mission);
    });
  }

  getAccessToken(username: string): string {
    return this.jwtService.sign(
      { username: username },
      {
        expiresIn: '1d',
      },
    );
  }

  async getRooms(username: string): Promise<TransferRoomDto[]> {
    const rooms: Room[] = await this.roomRepository.findBy({
      userRoomRelations: { user: { username: username } },
    });

    return rooms.map((room) => new TransferRoomDto(room));
  }

  async updateRefreshToken(username: string): Promise<void> {
    const refreshToken: string = this.jwtService.sign(
      { username: username },
      {
        expiresIn: '7d',
      },
    );

    await this.userRepository.update(
      { username: username },
      { refreshToken: refreshToken },
    );
    return;
  }

  async remove(username: string): Promise<void> {
    await this.userRepository.delete({ username: username });
    return;
  }
}
