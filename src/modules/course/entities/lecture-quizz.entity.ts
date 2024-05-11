import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from '.';

@Entity()
export class LectureQuizz {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @ManyToOne(() => Lecture, (lecture) => lecture.quizzs)
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;

  @Column('int', { name: 'quizz_id', nullable: false })
  quizzId: number;

  @Column('decimal', { nullable: false, name: 'question_time' })
  questionTime: number;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;
}
