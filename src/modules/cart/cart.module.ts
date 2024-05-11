import { Module, forwardRef } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UserModule } from '../user/user.module';
import { CourseModule } from '../course/course.module';
import { CourseBookmarkModule } from '../course-bookmark/course-bookmark.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UserModule,
    forwardRef(() => CourseModule),
    forwardRef(() => CourseBookmarkModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
