import { User } from '../../../modules/user/entities';
import { Course } from '../../../modules/course/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CourseBookmark {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

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

  @ManyToOne(() => Course, (course) => course.bookmarks)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
