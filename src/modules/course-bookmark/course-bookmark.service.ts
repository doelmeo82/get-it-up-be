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
import { CartService } from '../cart/cart.service';
import { CourseService } from '../course/providers';
import { UserService } from '../user/providers';
import { BookmarkOuput } from './dto';
import { BookmarkCourseDto } from './dto/create-course-bookmark.dto';
import { CourseBookmark } from './entities';

@Injectable()
export class CourseBookmarkService {
  constructor(
    @InjectRepository(CourseBookmark)
    private readonly bookmarkRepository: Repository<CourseBookmark>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
  ) {}

  async getUserBookmarks(
    userId: string,
  ): Promise<BaseApiResponse<BookmarkOuput[]>> {
    const bookmarks = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.course', 'course')
      .andWhere('bookmark.user_id = :user_id', { user_id: userId })
      .orderBy('bookmark.createdAt', 'DESC')
      .getMany();

    const instance = plainToInstance(BookmarkOuput, bookmarks, {
      excludeExtraneousValues: true,
    });

    await Promise.all(
      instance.map(async (item) => {
        const [bookmark, cart, paidCourse] = await Promise.all([
          this.getBookmarkById(item.course._id, userId),
          this.cartService.getPaidCart(userId, item.course._id),
          this.courseService.checkIsPaidOrder(userId, item.course._id)
        ]);
        item.course.isBookmark = bookmark ? true : false;
        item.course.isAddToCart = cart.data ? true : false;
        item.course.isPaid = paidCourse?.paymentStatus || cart?.data?.status || false;
      }),
    );
    const result = plainToInstance(BookmarkOuput, instance, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async bookmarkCourse(
    data: BookmarkCourseDto,
    userId: string,
  ): Promise<BaseApiResponse<null>> {
    const { courseId } = data;
    const [course, user, bookmark] = await Promise.all([
      this.courseService.getCourseById(courseId),
      this.userService.getUserByUserId(userId),
      this.getBookmarkById(courseId, userId),
    ]);
    if (!course.data || !user)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    if (bookmark) await this.bookmarkRepository.remove(bookmark);
    else {
      const createBookmark = this.bookmarkRepository.create();
      await this.bookmarkRepository.save({
        ...createBookmark,
        user,
        course: course.data,
      });
    }
    return {
      error: false,
      data: null,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }

  async getBookmarkById(
    courseId: number,
    userId: string,
  ): Promise<CourseBookmark | null> {
    const exist = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .andWhere('bookmark.user_id = :user_id', { user_id: userId })
      .andWhere('bookmark.course_id = :course_id', { course_id: courseId })
      .getOne();

    return exist;
  }
}
