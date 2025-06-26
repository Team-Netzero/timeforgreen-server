import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { TransferUserDto } from './dto/transfer-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) throw new NotFoundException('User not found');
    return new TransferUserDto(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  getAccessToken(username: string) {
    return this.jwtService.sign(
      { username: username },
      {
        expiresIn: '15m',
      },
    );
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
