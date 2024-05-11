import { Expose, Type } from 'class-transformer';
import { CartOutput } from '../../cart/dto/cart-output.dto';
import { CourseOutput } from '../../course/dto/course/course-output.dto';

export class OrderDetailOutput {
  @Expose()
  _id: number;

  @Expose()
  price: number;

  @Expose()
  @Type(() => CartOutput)
  cart: CartOutput;

  @Expose()
  @Type(() => CourseOutput)
  course: CourseOutput;
}
