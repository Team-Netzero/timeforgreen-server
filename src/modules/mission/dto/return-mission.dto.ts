import { Subject } from 'src/commons/enums/subject';
import { Mission } from '../mission.entity';

export class ReturnMissionDto {
  constructor(mission: Mission, username: string, roomId: string) {
    this.subject = mission.subject;
    this.createdAt = mission.createdAt;
    this.username = username;
    this.roomId = roomId;
  }
  subject: Subject;
  createdAt: Date;
  username: string;
  roomId: string;
}
