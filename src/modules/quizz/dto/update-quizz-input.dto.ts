import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateQuestionDto } from '../../exam/dto/update-question-input.dto';

export class UpdateQuizzInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  @IsOptional()
  questions?: UpdateQuestionDto[];
}
