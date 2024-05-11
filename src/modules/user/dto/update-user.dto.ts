import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { AddressInput } from '../../../modules/address/dto/address-input.dto';

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  @Length(5, 50)
  fullname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  gender?: boolean;

  // @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddressInput)
  address?: AddressInput;

  @IsNumber()
  @IsOptional()
  grade: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjectNames: string[];

  @IsNumber()
  @IsOptional()
  subjectGroup?: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateProfileDto {}
