import { Subject } from 'src/commons/enums/subject';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: Subject;

  @CreateDateColumn()
  createdAt: Date;
}
