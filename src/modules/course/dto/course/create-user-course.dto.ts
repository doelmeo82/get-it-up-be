import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserCourseInput {
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
