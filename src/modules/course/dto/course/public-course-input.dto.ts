import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class PublicCourseInput {
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
