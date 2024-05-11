import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { MESSAGES } from '../../common/constants';
import { CartInfoDto, CheckoutCartDto } from '../../payment/dto';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CartService } from '../cart/cart.service';
import { FilterCourseParticipants } from '../course/dto/course/filter-course.dto';
import { CourseService } from '../course/providers';
import { UserOutputDto } from '../user/dto';
import { UserService } from '../user/providers';
import { OrderOutput } from './dto/order-output.dto';
import { Order, OrderDetail } from './entities';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async updatePaymentStatus(_id: number): Promise<void> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'detail')
      .leftJoinAndSelect('detail.cart', 'cart')
      .leftJoinAndSelect('detail.course', 'course')
      .andWhere('order._id = :_id', { _id })
      .getOne();

    if (!order)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    order.paymentStatus = true;
    await Promise.all(
      order.orderDetails.map(async (detail) => {
        if (detail.cart) await this.cartService.updateCartStatus(detail.cart);
      }),
    );
    await Promise.all([
      this.orderRepository.save(order),
      this.courseService.genUserCourse(_id),
    ]);
  }

  async test(id: number) {
    return this.courseService.genUserCourse(id);
  }

  async getOrderById(id: number): Promise<BaseApiResponse<OrderOutput>> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderDetails', 'detail')
      .leftJoinAndSelect('detail.course', 'course')
      .leftJoinAndSelect('detail.cart', 'cart')
      .leftJoinAndSelect('cart.course', 'cart_course')
      .andWhere('order._id = :_id', { _id: id })
      .getOne();

    const result = plainToInstance(OrderOutput, order, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async createOrderDetail(data: CartInfoDto[]): Promise<OrderDetail[]> {
    const bulkDetail: OrderDetail[] = [];
    await Promise.all(
      data.map(async (item) => {
        let cart, course;
        const { courseId, cartId, price } = item;

        cartId ? (cart = await this.cartService.getCartById(cartId)) : null;
        courseId
          ? (course = await this.courseService.getCourseById(courseId))
          : null;
        const orderDetail = this.orderDetailRepository.create({
          cart,
          price,
          course: course?.data,
        });
        bulkDetail.push(orderDetail);
      }),
    );
    return bulkDetail;
  }

  async createOrder(
    ctx: RequestContext,
    data: CheckoutCartDto,
    total: number,
  ): Promise<OrderOutput> {
    const user = await this.userService.getUserByUserId(ctx.user.id);
    if (!user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    const orderDetails = await this.createOrderDetail(data.items);
    const order = this.orderRepository.create({
      ...data,
      orderDetails,
      user,
      total,
    });
    const created = await this.orderRepository.save(order);

    return plainToInstance(OrderOutput, created, {
      excludeExtraneousValues: true,
    });
  }

  async getPaidOrder(userId: string, courseId?: number): Promise<OrderOutput> {
    const builder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'detail')
      .andWhere('order.user_id = :user_id', { user_id: userId })
      .andWhere('order.payment_status = True');
    if (courseId)
      builder.andWhere('detail.course_id = :course_id', {
        course_id: courseId,
      });

    const exist = await builder.getOne();

    return plainToInstance(OrderOutput, exist, {
      excludeExtraneousValues: true,
    });
  }

  async getPaidCourses(userId: string): Promise<OrderOutput[]> {
    const builder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'detail')
      .leftJoinAndSelect('detail.course', 'course')
      .leftJoinAndSelect('detail.cart', 'cart')
      .leftJoinAndSelect('cart.course', 'cart_course')
      .andWhere('order.user_id = :user_id', { user_id: userId })
      .andWhere('order.payment_status = TRUE');
    const exist = await builder.getMany();

    return plainToInstance(OrderOutput, exist, {
      excludeExtraneousValues: true,
    });
  }

  async getCourseParticipants(
    filter: FilterCourseParticipants,
  ): Promise<BaseApiResponse<BasePaginationResponse<UserOutputDto>>> {
    const { courseId, page, limit } = filter;
    const builder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'detail')
      .leftJoinAndSelect('detail.course', 'course')
      .leftJoinAndSelect('detail.cart', 'cart')
      .leftJoinAndSelect('cart.course', 'cart_course')
      .leftJoinAndSelect('order.user', 'user')
      .andWhere('order.payment_status = TRUE')
      .andWhere('(course._id = :_id OR cart_course._id = :_id)', {
        _id: courseId,
      });

    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.take(limit);
    const [order, total] = await builder.getManyAndCount();
    const orderInstance = plainToInstance(OrderOutput, order, {
      excludeExtraneousValues: true,
    });
    const result = orderInstance.reduce((accummulator, instance) => {
      const output = plainToInstance(UserOutputDto, instance.user, {});
      return [...accummulator, output];
    }, [] as UserOutputDto[]);

    return {
      error: false,
      data: {
        listData: result,
        total,
        totalPage: Math.ceil(total / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }
}
