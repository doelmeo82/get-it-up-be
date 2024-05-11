import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../exam/entities';
import { UserQuizz } from './user-quizz.entity';

@Entity({ name: 'quizz' })
export class Quizz {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', { nullable: false, name: 'title' })
  title: string;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;

  @Column('varchar', { nullable: false, name: 'teacher_id' })
  teacherId: string;

  @OneToMany(() => Question, (question) => question.quizz, {
    cascade: ['insert', 'update', 'remove'],
    orphanedRowAction: 'delete',
  })
  questions: Question[];

  @OneToMany(() => UserQuizz, (userQuizz) => userQuizz.quizz)
  users: UserQuizz[];
}
