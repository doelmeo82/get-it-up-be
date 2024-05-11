import { Expose, Transform, Type } from 'class-transformer';
import { QuestionCorrectionOutput } from './question-output.dto';

export class TakeExamOutput {
  @Expose()
  title: string;

  @Expose()
  totalQuestions: number;

  @Expose()
  corrects: number;

  @Expose()
  incorrect: number;

  @Expose()
  selected: number;

  @Expose()
  unselected: number;

  @Expose()
  score: number;

  @Expose()
  time: number;

  @Expose()
  @Transform((value) => Math.ceil(value.value / 60), { toClassOnly: true })
  completeTime: number;

  @Expose()
  @Type(() => QuestionCorrectionOutput)
  corrections: QuestionCorrectionOutput[];
}
