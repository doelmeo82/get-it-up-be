import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateQuestionDto } from './update-question-input.dto';

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  subCategoryId?: number;

  @IsNumber()
  @IsOptional()
  time?: number;

  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @IsOptional()
  questions?: UpdateQuestionDto[];
}
