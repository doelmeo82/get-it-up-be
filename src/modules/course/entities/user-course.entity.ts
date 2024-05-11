import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities';
import { Course } from './course.entity';

@Entity()
export class UserCourse {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('int', { nullable: false, default: 1, name: 'current_section' })
  currentSection: number;

  @Column('int', { nullable: false, default: 1, name: 'current_lecture' })
  currentLecture: number;

  @Column('int', { nullable: false, default: 0, name: 'progress' })
  progress: number;

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

  @ManyToOne(() => Course, (course) => course.userCourses)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, (user) => user.userCourses)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
