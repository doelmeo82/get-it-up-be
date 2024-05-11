import { Expose, Transform, Type } from 'class-transformer';
import { QuestionOuput } from '../../exam/dto';

export class QuizzOutput {
  @Expose()
  _id: number;

  @Expose()
  title: string;

  @Expose()
  teacherId: string;

  @Expose()
  createdAt: Date;
}

export class QuizzDetailOutput extends QuizzOutput {
  @Transform((value) => value.value || false, { toClassOnly: true })
  @Expose()
  isComplete: boolean;

  @Expose()
  @Type(() => QuestionOuput)
  questions: QuestionOuput[];
}
