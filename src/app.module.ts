import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Room } from './modules/room/room.entity';
import { UserRoomRelation } from './modules/user-room-relation/user-room-relation.entity';
import { Mission } from './modules/mission/mission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'timeforgreen',
      password: 'timeforgreenpassword',
      database: 'timeforgreen',
      entities: [User, Room, UserRoomRelation, Mission],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
