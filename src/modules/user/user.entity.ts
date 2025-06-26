import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Mission } from '../mission/mission.entity';

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
  refreshToken: string;

  @OneToMany(
    () => UserRoomRelation,
    (userRoomRelation) => userRoomRelation.user,
  )
  userRoomRelations: UserRoomRelation[];

  @OneToMany(() => Mission, (mission) => mission.user)
  missions: Mission[];
}
