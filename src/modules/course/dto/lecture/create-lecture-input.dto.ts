import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LECTURE_TYPE } from '../../../../shared/enums';
import { Type } from 'class-transformer';
import { CreateLectureQuizzInput } from '../lecture-quizz-input.dto.ts/create-lecture-quizz-input.dto';

export class CreateLecture {
  @IsNotEmpty()
  @IsString()
  lectureName: string;

  @IsNotEmpty()
  @IsEnum(LECTURE_TYPE)
  lectureType: LECTURE_TYPE;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  duration: number;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  slug: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  examId: number;

  @ValidateNested({ each: true })
  @Type(() => CreateLectureQuizzInput)
  @IsOptional()
  quizzs: CreateLectureQuizzInput[];
}
