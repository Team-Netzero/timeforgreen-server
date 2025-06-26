import { Subject } from 'src/commons/enums/subject';
import { Room } from '../room.entity';

export class TransferRoomDto {
  constructor(room: Room) {
    this.id = room.id;
    this.title = room.title;
    this.activated = room.activated;
    this.allowNotificationAt = room.allowNotificationAt;
  }
  id: string;
  title: string;
  activated: boolean;
  allowNotificationAt: string;
}
