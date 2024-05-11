import { User } from '../../../modules/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exam } from './exam.entity';

@Entity()
export class UserExam {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('decimal', {
    nullable: false,
    name: 'complete_time',
    precision: 10,
    scale: 2,
  })
  completeTime: number;

  @Column('int', { nullable: false, default: 0, name: 'corrects' })
  corrects: number;

  @Column('int', { nullable: false, default: 0, name: 'total_questions' })
  totalQuestions: number;

  @Column('decimal', { nullable: false, default: 0.0, name: 'score' })
  score: number;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.exams)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.users)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
