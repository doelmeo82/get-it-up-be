import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLectureQuizzInput {
  @IsNumber()
  @IsNotEmpty()
  quizzId: number;

  @IsNumber()
  @IsNotEmpty()
  questionTime: number;
}
