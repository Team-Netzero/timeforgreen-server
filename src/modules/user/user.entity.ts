import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRoomRelation } from '../user-room-relation/user-room-relation.entity';
import { Mission } from '../mission/mission.entity';

@Entity()
export class User {
  @PrimaryColumn()
  username!: string;

  @Column({ nullable: true })
  profileImage: string = 'defaultProfileImageUrl';

  @Column()
  hashedPassword!: string;

  @Column({ nullable: true })
  refreshToken!: string;

  @OneToMany(
    () => UserRoomRelation,
    (userRoomRelation) => userRoomRelation.user,
  )
  userRoomRelations!: UserRoomRelation[];

  @OneToMany(() => Mission, (mission) => mission.user)
  missions!: Mission[];
}
