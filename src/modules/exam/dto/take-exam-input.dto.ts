import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class AnswerQuestionInput {
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  answer: number[];
}

export class TakeExamInput {
  @IsNotEmpty()
  @IsNumber()
  examId: number;

  @IsNotEmpty()
  @IsNumber()
  completeTime: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerQuestionInput)
  answers: AnswerQuestionInput[];
}
