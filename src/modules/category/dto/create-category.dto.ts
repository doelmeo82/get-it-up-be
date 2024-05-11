import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCategory {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  categoryName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
