import { Expose, Type } from 'class-transformer';
import { QuestionOuput } from './question-output.dto';
import { CategoryOutput } from '../../../modules/category/dto';

export class FilterExamOutput {
  @Expose()
  _id: number;

  @Expose()
  title: string;

  @Expose()
  categoryId: number;

  @Expose()
  subCategoryId: number;

  @Expose()
  time: number;

  @Expose()
  teacherId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  category?: CategoryOutput;

  @Expose()
  subCategory?: CategoryOutput;
}

export class ExamDetailOutput extends FilterExamOutput {
  @Expose()
  @Type(() => QuestionOuput)
  questions: QuestionOuput[];
}
