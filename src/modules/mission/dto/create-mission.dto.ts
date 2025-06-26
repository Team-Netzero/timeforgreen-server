import { Subject } from 'src/commons/enums/subject';

export class CreateMissionDto {
  subject: Subject;
  roomId: string;
}
