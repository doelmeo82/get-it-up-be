import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddressInput {
  @IsNotEmpty()
  @IsNumber()
  province: number;

  @IsNotEmpty()
  @IsNumber()
  district: number;

  @IsNotEmpty()
  @IsString()
  detail: string;
}
