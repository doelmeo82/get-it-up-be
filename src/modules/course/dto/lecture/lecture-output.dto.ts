import { Expose } from 'class-transformer';
import { LECTURE_TYPE } from '../../../../shared/enums';

export class LectureOutput {
  @Expose()
  _id!: number;

  @Expose()
  lectureName!: string;

  @Expose()
  lectureType: LECTURE_TYPE;

  @Expose()
  examId: number;

  @Expose()
  duration: number;

  @Expose()
  url: string;

  @Expose()
  slug: string;
}
