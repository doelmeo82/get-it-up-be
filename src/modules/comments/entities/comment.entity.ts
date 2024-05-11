import { User } from '../../../modules/user/entities';
import { Lecture } from '../../../modules/course/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column('varchar', { nullable: false, name: 'author_name' })
  author: string;

  @Column('text', { nullable: true, name: 'author_thumbnail' })
  authorThumbnail: string;

  @Column('text', { nullable: false, name: 'content' })
  content: string;

  @Column('int', { nullable: false, default: 0, name: 'like_count' })
  likeCount: number;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;

  @ManyToOne(() => Lecture, (lecture) => lecture.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lecture_id' })
  lecture: Lecture;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
