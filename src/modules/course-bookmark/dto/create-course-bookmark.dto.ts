import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookmarkCourseDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
