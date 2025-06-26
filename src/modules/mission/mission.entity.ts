import { Subject } from 'src/commons/enums/subject';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: Subject;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.missions)
  user: User;

  @ManyToOne(() => Room, (room) => room.missions)
  room: Room;
}
