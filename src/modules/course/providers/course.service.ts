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
import { MESSAGES } from '../../../common/constants';
import { UserService } from '../../../modules/user/providers';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import {
  FilterCourseDto,
  FilterCourseParticipants,
  TeacherFilterCourses,
} from '../dto/course/filter-course.dto';
import { Course } from '../entities';
import { SectionService } from './section.service';
import { CategoryService } from '../../../modules/category/category.service';
import { CategoryOutput } from 'src/modules/category/dto';
import { PublicCourseInput } from '../dto/course/public-course-input.dto';
import { CartService } from '../../../modules/cart/cart.service';
import { CourseBookmarkService } from '../../../modules/course-bookmark/course-bookmark.service';
import { OrderService } from '../../../modules/order/order.service';
import { UserOutputDto } from '../../../modules/user/dto';
import { OrderOutput } from 'src/modules/order/dto';
import { CourseOutput } from '../dto/course/course-output.dto';
import { CreateCourseDto } from '../dto/course/create-course.dto';
import { StatisticOutput } from '../dto/course/statistic-output.dto';
import { UserCourseService } from './user-course.service';
import { User } from '../../user/entities';

@Injectable()
export class CourseService {
  DOMAIN = 'https://www.googleapis.com/youtube/v3';
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly sectionService: SectionService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,
    @Inject(forwardRef(() => CourseBookmarkService))
    private readonly bookmarkService: CourseBookmarkService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly userCourseService: UserCourseService,
  ) {}

  async checkIsPaidOrder(
    userId: string,
    courseId: number,
  ): Promise<OrderOutput> {
    return this.orderService.getPaidOrder(userId, courseId);
  }

  async getCourseById(
    _id: number,
    userId?: string,
  ): Promise<BaseApiResponse<CourseOutput>> {
    const builder = this.courseRepository.createQueryBuilder('course');
    builder.leftJoinAndSelect('course.sections', 'sections');
    builder.leftJoinAndSelect('sections.lectures', 'lectures');
    builder.andWhere('course._id = :_id', { _id });
    builder.orderBy('sections.sectionName', 'ASC');

    const course = await builder.getOne();
    const instance = plainToInstance(CourseOutput, course, {
      excludeExtraneousValues: true,
    });

    if (userId) {
      const [paidCart, bookmark, paidCourse] = await Promise.all([
        this.cartService.getPaidCart(userId, instance._id),
        this.bookmarkService.getBookmarkById(instance._id, userId),
        this.orderService.getPaidOrder(userId, instance._id),
      ]);
      instance.isPaid =
        paidCourse?.paymentStatus || paidCart?.data?.status || false;
      instance.isAddToCart = paidCart?.data ? true : false;
      instance.isBookmark = bookmark ? true : false;
    }

    const result = plainToInstance(CourseOutput, instance, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async create(
    teacherId: string,
    data: CreateCourseDto,
  ): Promise<BaseApiResponse<CourseOutput>> {
    const teacher = await this.userService.getUserByUserId(teacherId);
    if (!teacher)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    const { sections } = data;
    const course = this.courseRepository.create(data);
    const [includeSections, totalDuration] =
      this.sectionService.create(sections);
    const createCourse = await this.courseRepository.save({
      ...course,
      sections: includeSections,
      teacherId,
      totalDuration,
    });
    const result = plainToInstance(CourseOutput, createCourse, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }

  async publicCourse(data: PublicCourseInput): Promise<BaseApiResponse<null>> {
    const { courseId, isPublic } = data;
    const course = await this.courseRepository.findOne({
      where: { _id: courseId },
    });
    if (!course)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    await this.courseRepository.update(
      { _id: courseId },
      {
        isPublic,
      },
    );
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  async teacherGetCourse(
    teacherId: string,
    filter: TeacherFilterCourses,
  ): Promise<BaseApiResponse<BasePaginationResponse<CourseOutput>>> {
    const { search, page, limit } = filter;
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    queryBuilder.andWhere('course.teacherId = :teacherId', { teacherId });
    if (search)
      queryBuilder.andWhere(
        'UPPER(course.courseName) LIKE UPPER(:courseName)',
        {
          courseName: `%${search}%`,
        },
      );
    if (page) queryBuilder.skip((page - 1) * limit);
    if (limit) queryBuilder.take(limit);
    const [courses, count] = await queryBuilder.getManyAndCount();
    const instance = plainToInstance(CourseOutput, courses, {
      excludeExtraneousValues: true,
    });

    // Get category info
    await Promise.all(
      instance.map(async (course) => {
        const [category, subCategory] = await Promise.all([
          this.categoryService.getCategoryById(course.categoryId),
          this.categoryService.getCategoryById(course.subCategoryId),
        ]);
        course.category = plainToInstance(CategoryOutput, category);
        course.subCategory = plainToInstance(CategoryOutput, subCategory);
      }),
    );
    const result = plainToInstance(CourseOutput, instance, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: {
        listData: result,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async filterCourses(
    userId: string,
    filter: FilterCourseDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<CourseOutput>>> {
    const {
      categoryId,
      subCategoryId,
      startPrice,
      endPrice,
      page,
      limit,
      search,
      startDuration,
      endDuration,
    } = filter;
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    queryBuilder.andWhere('course.isPublic = TRUE');
    if (search)
      queryBuilder.andWhere(
        'UPPER(course.courseName) LIKE UPPER(:courseName)',
        {
          courseName: `%${search}%`,
        },
      );
    if (categoryId)
      queryBuilder.andWhere('course.categoryId = :categoryId', { categoryId });
    if (subCategoryId)
      queryBuilder.andWhere('course.subCategoryId IN (:...subCategoryId)', {
        subCategoryId,
      });
    if (startPrice)
      queryBuilder.andWhere('course.price >= :startPrice', { startPrice });
    if (endPrice)
      queryBuilder.andWhere('course.price <= :endPrice', { endPrice });
    if (startDuration && endDuration)
      queryBuilder.andWhere(
        'course.total_duration >= :startDuration AND course.total_duration <= :endDuration',
        {
          startDuration: startDuration * 60,
          endDuration: endDuration * 60,
        },
      );
    if (page) queryBuilder.skip((page - 1) * limit);
    if (limit) queryBuilder.take(limit);
    queryBuilder.orderBy('course.courseName', 'ASC');
    const [courses, count] = await queryBuilder.getManyAndCount();
    const instance = plainToInstance(CourseOutput, courses);
    // Get category info
    await Promise.all(
      instance.map(async (course) => {
        const [category, subCategory] = await Promise.all([
          this.categoryService.getCategoryById(course.categoryId),
          this.categoryService.getCategoryById(course.subCategoryId),
        ]);
        course.category = plainToInstance(CategoryOutput, category);
        course.subCategory = plainToInstance(CategoryOutput, subCategory);
        if (userId) {
          const [paidCart, bookmark, paidOrder] = await Promise.all([
            this.cartService.getPaidCart(userId, course._id),
            this.bookmarkService.getBookmarkById(course._id, userId),
            this.orderService.getPaidOrder(userId, course._id),
          ]);
          course.isPaid =
            paidOrder?.paymentStatus || paidCart?.data?.status || false;
          course.isAddToCart = paidCart?.data ? true : false;
          course.isBookmark = bookmark ? true : false;
        }
      }),
    );
    const result = plainToInstance(CourseOutput, instance, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: {
        listData: result,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getPaidCourse(
    userId: string,
  ): Promise<BaseApiResponse<CourseOutput[]>> {
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

    const paidCourses = await this.orderService.getPaidCourses(userId);
    const courses: CourseOutput[] = [];
    paidCourses.map((paid) => {
      const detail = paid.orderDetails;

      detail.map((item) => {
        const course = item?.cart?.course || item?.course;
        course.isPaid = true;
        courses.push(course);
      });
    });

    const result = plainToInstance(CourseOutput, courses, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getCourseParticipants(
    filter: FilterCourseParticipants,
  ): Promise<BaseApiResponse<BasePaginationResponse<UserOutputDto>>> {
    const result = await this.orderService.getCourseParticipants(filter);
    return result;
  }

  async getCourseStatistic(
    techerId: string,
  ): Promise<BaseApiResponse<StatisticOutput>> {
    const builder = this.courseRepository
      .createQueryBuilder('course')
      .andWhere('course.teacher_id = :teacher_id', { teacher_id: techerId });
    const [total, publicTotal] = await Promise.all([
      builder.getCount(),
      builder.clone().andWhere('course.isPublic = TRUE').getCount(),
    ]);

    // Get total students in course
    const studentsBuilder = builder
      .clone()
      .leftJoinAndSelect('course.cart', 'cart')
      .leftJoinAndSelect('cart.orderDetails', 'cart_detail')
      .leftJoinAndSelect('course.orderDetails', 'course_detail')
      .leftJoinAndSelect('cart_detail.order', 'cart_order')
      .leftJoinAndSelect('course_detail.order', 'course_order')
      .andWhere(
        '(cart_order.paymentStatus = TRUE OR course_order.paymentStatus = TRUE)',
      );
    const paidCourses = await studentsBuilder.getMany();
    const listStudent = [];
    for (const current of paidCourses) {
      const filter = plainToInstance(FilterCourseParticipants, {
        courseId: current._id,
      });
      const participants = await this.getCourseParticipants(filter);
      const listStudents = participants.data.listData;
      listStudent.push(...listStudents);
    }
    const uniqueStudentIds = new Set(listStudent.map((student) => student._id));
    const totalStudents = uniqueStudentIds.size;
    return {
      error: true,
      data: {
        total,
        publicTotal,
        totalStudents,
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async genUserCourse(orderId: number): Promise<void> {
    const order = await this.orderService.getOrderById(orderId);
    const instance = order.data;
    const detail = instance.orderDetails;
    const user = plainToInstance(User, instance.user);

    await Promise.all(
      detail.map(async (item) => {
        const course = item?.cart?.course || item?.course;
        const courseInstance = plainToInstance(Course, course);
        await this.userCourseService.create(courseInstance, user);
      }),
    );
  }
}
