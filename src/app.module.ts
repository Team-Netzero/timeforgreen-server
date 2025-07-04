import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Room } from './modules/room/room.entity';
import { UserRoomRelation } from './modules/user-room-relation/user-room-relation.entity';
import { Mission } from './modules/mission/mission.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/file/files.module';
import { RoomModule } from './modules/room/room.module';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    AuthModule,
    FilesModule,
    RoomModule,
    UserModule,
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
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
    consumer.apply(AuthMiddleware).exclude('/auth/*path').forRoutes('*path');
  }
}
