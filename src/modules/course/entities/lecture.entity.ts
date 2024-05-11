import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Section } from '.';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { LECTURE_TYPE } from '../../../shared/enums';
import { LectureQuizz } from './lecture-quizz.entity';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', { nullable: false, length: 255, name: 'lecture_name' })
  lectureName!: string;

  @Column({
    type: 'enum',
    enum: LECTURE_TYPE,
    name: 'lecture_type',
  })
  lectureType: LECTURE_TYPE;

  @Column('int', { nullable: true, name: 'duration' })
  duration: number;

  @Column('varchar', { nullable: true, name: 'url' })
  url: string;

  @Column('varchar', { nullable: true, name: 'slug', unique: true })
  slug: string;

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

  @ManyToOne(() => Section, (section) => section.lectures)
  section: Section;

  @Column('int', { nullable: true, name: 'exam_id' })
  examId: number;

  @OneToMany(() => LectureQuizz, (quizz) => quizz.lecture, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
  })
  quizzs: LectureQuizz[];

  @OneToMany(() => Comment, (comnent) => comnent.lecture, {
    cascade: ['update', 'remove'],
    orphanedRowAction: 'delete',
  })
  comments: Comment[];
}
