import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Room } from './modules/room/room.entity';
import { UserRoomRelation } from './modules/user-room-relation/user-room-relation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'timeforgreen',
      password: 'timeforgreenpassword',
      database: 'timeforgreen',
      entities: [User, Room, UserRoomRelation],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
