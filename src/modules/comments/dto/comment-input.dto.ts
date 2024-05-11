import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentInput {
  @IsNumber()
  @IsNotEmpty()
  lectureId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
