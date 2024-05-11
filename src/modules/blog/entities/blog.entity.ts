import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities';
import { BLOG_STATUS } from '@/src/shared/enums';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', { nullable: false, name: 'title' })
  title: string;

  @Column('varchar', { nullable: false, name: 'tags', array: true })
  tags: string[];

  @Column('text', { nullable: false, name: 'content' })
  content: string;

  @Column('varchar', { nullable: false, name: 'preview_content' })
  previewContent: string;

  @Column({
    type: 'enum',
    enum: BLOG_STATUS,
    nullable: false,
    name: 'status',
    default: BLOG_STATUS.PENDING,
  })
  status: BLOG_STATUS;

  @Column('varchar', { nullable: true, name: 'decline_reason' })
  declineReason: string;

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
}
