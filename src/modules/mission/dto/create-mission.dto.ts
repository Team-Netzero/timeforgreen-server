import { Subject } from 'src/commons/enums/subject';

export type CreateMissionDto = {
  subject: Subject;
  roomId: string;
};
