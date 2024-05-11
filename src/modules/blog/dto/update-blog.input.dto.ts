import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateBlogInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  previewContent?: string;
}
