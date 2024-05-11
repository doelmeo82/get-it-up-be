import { IsNumber, IsOptional } from 'class-validator';
import { PaginationParamsDto } from '../../../shared/dtos';
import { Type } from 'class-transformer';

export class FilterExamDto extends PaginationParamsDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  subCategoryId?: number;
}
