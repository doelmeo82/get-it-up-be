import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateLecture } from '../lecture/create-lecture-input.dto';

export class CreateSection {
  @IsNotEmpty()
  @IsString()
  sectionName: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateLecture)
  lectures: CreateLecture[];
}
