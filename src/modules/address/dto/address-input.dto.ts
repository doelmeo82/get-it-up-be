import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressInput {
  @IsNumber()
  @IsOptional()
  province?: number;

  @IsNumber()
  @IsOptional()
  district?: number;

  @IsString()
  @IsOptional()
  detail?: string;
}
