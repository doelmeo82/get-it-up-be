import { Expose, Type } from 'class-transformer';
import { CourseOutput } from '../../course/dto/course/course-output.dto';

export class BookmarkOuput {
  @Expose()
  @Type(() => CourseOutput)
  course: CourseOutput;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
