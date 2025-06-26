import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
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
  async create(createUserDto: CreateUserDto) {
    if (
      await this.userRepository.existsBy({ username: createUserDto.username })
    )
      throw new UnprocessableEntityException('Username already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userInstance = this.userRepository.create({
      username: createUserDto.username,
      hashedPassword: hashedPassword,
    });

    const user = await this.userRepository.save(userInstance);
    if (!user)
      throw new InternalServerErrorException(
        'Failed to create user due to unknown error',
      );

    return user.username;
  }

  async createMission(username: string, createMissionDto: CreateMissionDto) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) throw new NotFoundException('User not found');

    const room = await this.roomRepository.findOneBy({
      id: createMissionDto.roomId,
    });
    if (!room) throw new NotFoundException('Room not found');

    const missionInstance = this.missionRepository.create({
      subject: createMissionDto.subject,
      user: user,
      room: room,
    });

    const mission = await this.missionRepository.save(missionInstance);
    if (!mission)
      throw new InternalServerErrorException(
        'Failed to create mission due to unknown error',
      );

    return;
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) throw new NotFoundException('User not found');
    return new TransferUserDto(user);
  }

  async getMissions(username: string) {
    const missions = await this.missionRepository.find({
      where: { user: { username: username } },
      relations: { room: true },
    });
    return missions.map((mission) => {
      return new ReturnMissionDto(
        mission,
        mission.user.username,
        mission.room.id,
      );
    });
  }

  getAccessToken(username: string) {
    return this.jwtService.sign(
      { username: username },
      {
        expiresIn: '15m',
      },
    );
  }

  async getRooms(username: string) {
    const rooms = await this.roomRepository.findBy({
      userRoomRelations: { user: { username: username } },
    });

    return rooms.map((room) => new TransferRoomDto(room));
  }

  async updateRefreshToken(username: string) {
    const refreshToken = this.jwtService.sign(
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

  async remove(username: string) {
    await this.userRepository.delete({ username: username });
    return;
  }
}
