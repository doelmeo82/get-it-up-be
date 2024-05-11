import { Expose, Type } from 'class-transformer';
import { QuizzDetailOutput } from '../../../quizz/dto';
import { LectureOutput } from './lecture-output.dto';

export class LectureQuizzOutput {
  @Expose()
  _id: number;

  @Type(() => LectureOutput)
  @Expose()
  lecture: LectureOutput;

  @Expose()
  quizzId: number;

  @Type(() => QuizzDetailOutput)
  @Expose()
  quizz: QuizzDetailOutput;

  @Type(() => Number)
  @Expose()
  questionTime: number;

  @Expose()
  createdAt!: Date;
}
