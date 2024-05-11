import { CourseOutput } from '@/src/modules/course/dto/course/course-output.dto';
import { Expose, Type } from 'class-transformer';

export class TransactionOutput {
  @Expose()
  status: string;

  @Expose()
  @Type(() => CourseOutput)
  courses: CourseOutput[];
}
