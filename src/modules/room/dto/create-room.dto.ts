import { Subject } from 'src/commons/enums/subject';
import { Room } from '../room.entity';

export class CreateRoomDto {
  title: string;
  allowNotificationAt: string;
}
