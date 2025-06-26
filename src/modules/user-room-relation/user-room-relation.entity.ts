import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';
import { Role } from 'src/commons/enums/role';

@Entity()
export class UserRoomRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoomRelations)
  user: User;

  @ManyToOne(() => Room, (room) => room.userRoomRelations)
  room: Room;

  @Column()
  role: Role;
}
