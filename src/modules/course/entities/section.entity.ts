import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course, Lecture } from '.';

@Entity()
export class Section {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', { nullable: false, length: 100, name: 'section_name' })
  sectionName!: string;

  @OneToMany(() => Lecture, (lecture) => lecture.section, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
  })
  lectures: Lecture[];

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

  @ManyToOne(() => Course, (course) => course.sections)
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
