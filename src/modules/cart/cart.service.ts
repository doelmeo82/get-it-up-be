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
import { BaseApiResponse } from '../../shared/dtos';
import { CourseBookmarkService } from '../course-bookmark/course-bookmark.service';
import { CourseService } from '../course/providers';
import { UserService } from '../user/providers';
import { CreateCartDto } from './dto';
import { CartOutput, SummaryCartOutput } from './dto/cart-output.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => CourseBookmarkService))
    private readonly bookmarkService: CourseBookmarkService,
  ) {}

  async getCartById(id: number): Promise<CartOutput> {
    const carts = await this.cartRepository.findOne({
      where: { _id: id },
      relations: ['course'],
    });
    const result = plainToInstance(CartOutput, carts, {
      excludeExtraneousValues: true,
    });

    return result;
  }

  async updateCartStatus(cart: Cart): Promise<void> {
    await this.cartRepository.save({
      ...cart,
      status: true,
    });
  }

  async getPaidCart(
    userId: string,
    courseId: number,
  ): Promise<BaseApiResponse<CartOutput>> {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .andWhere('cart.course_id = :course_id', { course_id: courseId })
      .andWhere('cart.user_id = :user_id', { user_id: userId })
      .getOne();

    const result = plainToInstance(CartOutput, cart, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getMyCart(userId: string): Promise<BaseApiResponse<SummaryCartOutput>> {
    const user = await this.userService.getUserByUserId(userId);
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
    const carts = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.course', 'course')
      .andWhere('cart.user_id = :user_id', { user_id: userId })
      .andWhere('cart.status = :status', { status: false })
      .getMany();
    const instance = plainToInstance(CartOutput, carts, {
      excludeExtraneousValues: true,
    });
    await Promise.all(
      instance.map(async (cart) => {
        const bookmark = await this.bookmarkService.getBookmarkById(
          cart.course._id,
          userId,
        );
        cart.course.isBookmark = bookmark ? true : false;
        cart.course.isAddToCart = true;
      }),
    );
    const cartOutput = plainToInstance(CartOutput, instance, {
      excludeExtraneousValues: true,
    });

    const originalPrice = carts.reduce((total, current) => {
      const price = current.course.price;
      return total + price;
    }, 0);
    const total = carts.reduce((total, current) => {
      const price = current.course.price;
      const discount = current.discount;
      const afterDiscount = price - (price * discount) / 100;
      return total + afterDiscount;
    }, 0);

    const result = plainToInstance(SummaryCartOutput, {
      originalPrice,
      total,
      carts: cartOutput,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async addToCart(
    userId: string,
    data: CreateCartDto,
  ): Promise<BaseApiResponse<null>> {
    const { courseId } = data;
    const [user, course] = await Promise.all([
      this.userService.getUserByUserId(userId),
      this.courseService.getCourseById(courseId),
    ]);

    if (!user || !course.data)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    const newCart = this.cartRepository.create();
    await this.cartRepository.save({
      ...newCart,
      user,
      course: course.data,
    });

    return {
      error: false,
      data: null,
      message: MESSAGES.ADD_CART_SUCCEED,
      code: 200,
    };
  }

  async removeCart(id: number, userId: string): Promise<BaseApiResponse<null>> {
    const cart = await this.cartRepository.findOne({
      where: { _id: id },
      relations: ['user'],
    });
    if (!cart)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );

    if (cart.user._id !== userId)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 404,
        },
        HttpStatus.UNAUTHORIZED,
      );
    await this.cartRepository.delete({ _id: id });
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETE_SUCCEED,
      code: 200,
    };
  }
}
