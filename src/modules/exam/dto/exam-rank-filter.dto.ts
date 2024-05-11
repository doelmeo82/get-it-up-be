import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationParamsDto } from '../../../shared/dtos';
import { Expose, Type } from 'class-transformer';
import { UserOutputDto } from '../../../modules/user/dto';
import { ExamDetailOutput } from './exam-output.dto';

export class ExamRankingFilter extends PaginationParamsDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  examId: number;
}

export class ExamRankingOutput {
  @Expose()
  completeTime: number;

  @Expose()
  score: number;

  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @Expose()
  @Type(() => ExamDetailOutput)
  exam: ExamDetailOutput;
}
