import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from '../../exam/dto';

export class CreateQuizzInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
