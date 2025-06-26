import { Subject } from 'src/commons/enums/subject';
import { Mission } from '../mission.entity';

export class ReturnMissionDto {
  constructor(mission: Mission) {
    this.subject = mission.subject;
    this.createdAt = mission.createdAt;
  }
  subject: Subject;
  createdAt: Date;
}
