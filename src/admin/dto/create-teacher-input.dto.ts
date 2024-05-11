import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLES } from '../../shared/enums';
import { RegisterInput } from '../../auth/dtos';

export class CreateTeacherInput extends RegisterInput {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @Transform(() => ROLES.TEACHER)
  @IsEnum(ROLES)
  role: ROLES;

  @Type(() => Date)
  @IsOptional()
  birthDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  subjects: number[];

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  memo: string;
}
