import { Module } from '@nestjs/common';
import * as providers from './providers';
import * as controllers from './controllers';
import { CommonModule } from '../common';
import { CartModule } from '../modules/cart/cart.module';
import { OrderModule } from '../modules/order/order.module';

@Module({
  imports: [CommonModule, CartModule, OrderModule],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class PaymentModule {}
