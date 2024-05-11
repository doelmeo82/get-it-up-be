import { PaginationParamsDto } from '@/src/shared/dtos';
import { BLOG_STATUS } from '@/src/shared/enums';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class FilterBlogInput extends PaginationParamsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @Transform(({ value }) => value.split(',').map(String))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsEnum(BLOG_STATUS)
  @IsOptional()
  status?: BLOG_STATUS;
}
