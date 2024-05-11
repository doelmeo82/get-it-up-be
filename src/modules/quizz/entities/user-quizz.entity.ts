import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities';
import { Quizz } from './quizz.entity';

@Entity()
export class UserQuizz {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @ManyToOne(() => User, (user) => user.quizzs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Quizz, (quizz) => quizz.users)
  @JoinColumn({ name: 'quizz_id' })
  quizz: Quizz;

  @Column('boolean', { nullable: false, default: false })
  status: boolean;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;
}
