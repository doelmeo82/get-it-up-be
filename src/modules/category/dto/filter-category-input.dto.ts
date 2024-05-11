import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterCategoryInput {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  subCategoryId?: number;
}
