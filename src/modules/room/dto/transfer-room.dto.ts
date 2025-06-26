import { Subject } from 'src/commons/enums/subject';
import { Room } from '../room.entity';

export class TransferRoomDto {
  constructor(room: Room) {
    this.id = room.id;
    this.subject = room.subject;
    this.activated = room.activated;
    this.allowNotificationAt = room.allowNotificationAt;
  }
  id: string;
  subject: Subject;
  activated: boolean;
  allowNotificationAt: string;
}
