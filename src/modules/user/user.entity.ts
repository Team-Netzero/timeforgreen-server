import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  profileImage: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  refreshToken: string | null;

  @OneToMany(
    () => UserRoomRelation,
    (userRoomRelation) => userRoomRelation.user,
  )
  userRoomRelations: UserRoomRelation[];
}
