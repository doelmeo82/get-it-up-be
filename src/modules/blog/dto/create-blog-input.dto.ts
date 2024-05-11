import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  previewContent: string;
}
