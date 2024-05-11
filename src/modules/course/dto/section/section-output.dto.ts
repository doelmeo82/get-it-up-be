import { Expose, Type } from 'class-transformer';
import { LectureOutput } from '../lecture/lecture-output.dto';

export class SectionOutput {
  @Expose()
  _id!: number;

  @Expose()
  sectionName!: string;

  @Expose()
  @Type(() => LectureOutput)
  lectures: LectureOutput[];
}
