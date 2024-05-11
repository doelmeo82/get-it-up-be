import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { PAYMENT_METHOD } from '../../shared/enums';
import { Type } from 'class-transformer';

export class CartInfoDto {
  @IsNumber()
  @IsOptional()
  courseId: number;

  @IsNumber()
  @IsOptional()
  cartId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
export class CheckoutCartDto {
  @IsNotEmpty()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CartInfoDto)
  items: CartInfoDto[];
}
