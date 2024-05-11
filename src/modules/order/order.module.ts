import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderDetail } from './entities';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    CartModule,
    UserModule,
    forwardRef(() => CourseModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
