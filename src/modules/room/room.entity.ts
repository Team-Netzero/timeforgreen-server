import { Subject } from 'src/commons/enums/subject';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Mission } from '../mission/mission.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: Subject;

  @Column()
  activated: boolean;

  @Column()
  allowNotificationAt: string;

  @OneToMany(
    () => UserRoomRelation,
    (userRoomRelation) => userRoomRelation.room,
  )
  userRoomRelations: UserRoomRelation[];

  @OneToMany(() => Mission, (mission) => mission.room)
  missions: Mission[];
}
