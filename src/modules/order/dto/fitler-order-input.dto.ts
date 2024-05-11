import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationParamsDto } from '../../../shared/dtos';

export class FilterOrderInput extends PaginationParamsDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
