import { Expose, Type } from 'class-transformer';
import { PAYMENT_METHOD } from '../../../shared/enums';
import { OrderDetailOutput } from './order-detail-output.dto';
import { UserOutputDto } from '../../../modules/user/dto';

export class OrderOutput {
  @Expose()
  _id!: number;

  @Expose()
  total: number;

  @Expose()
  paymentStatus: boolean;

  @Expose()
  paymentMethod: PAYMENT_METHOD;

  @Expose()
  @Type(() => OrderDetailOutput)
  orderDetails: OrderDetailOutput[];

  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;
}
