import { MESSAGES } from '@/src/common/constants';
import { BaseApiResponse, BasePaginationResponse } from '@/src/shared/dtos';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import {
  ApproveBlogInput,
  BlogOutput,
  CreateBlogInput,
  FilterBlogInput,
  ListBlogOutput,
  UpdateBlogInput,
} from './dto';
import { Blog } from './entities/blog.entity';
import { UserService } from '../user/providers';
import { BLOG_STATUS } from '@/src/shared/enums';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: string,
    data: CreateBlogInput,
  ): Promise<BaseApiResponse<null>> {
    const blog = this.blogRepository.create({
      ...data,
      status: BLOG_STATUS.ACCEPTED,
    });

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

    await this.blogRepository.save({ ...blog, user });

    return {
      error: false,
      data: null,
      code: 201,
      message: MESSAGES.CREATED_SUCCEED,
    };
  }

  async update(
    _id: number,
    data: UpdateBlogInput,
  ): Promise<BaseApiResponse<BlogOutput>> {
    const exist = await this.blogRepository.findOne({ where: { _id } });
    if (!exist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );

    this.blogRepository.merge(exist, data);
    const blog = await this.blogRepository.save(exist);
    const result = plainToInstance(BlogOutput, blog, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      code: 200,
      message: MESSAGES.UPDATE_SUCCEED,
    };
  }

  async delete(_id: number): Promise<BaseApiResponse<null>> {
    await this.blogRepository.delete({ _id });
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETE_SUCCEED,
      code: 200,
    };
  }

  async getList(
    filter: FilterBlogInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<ListBlogOutput>>> {
    const { page, limit, tags, title, status } = filter;
    const builder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user');

    if (status) builder.andWhere('blog.status = :status', { status });
    if (tags)
      builder.andWhere('blog.tags::text[] && ARRAY[:...tags]', { tags });
    if (title) builder.andWhere('blog.title = :title', { title });
    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.limit(limit);

    builder.orderBy('blog.updated_at', 'DESC');
    const [blogs, total] = await builder.getManyAndCount();
    const data = plainToInstance(ListBlogOutput, blogs, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: {
        listData: data,
        total,
        totalPage: Math.ceil(total / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getMyBlogs(
    userId: string,
    filter: FilterBlogInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<ListBlogOutput>>> {
    const { page, limit, tags, title, status } = filter;
    const builder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user');

    if (status) builder.andWhere('blog.status = :status', { status });
    if (tags)
      builder.andWhere('blog.tags::text[] && ARRAY[:...tags]', { tags });
    if (title) builder.andWhere('blog.title = :title', { title });
    if (userId) builder.andWhere('blog.user_id = :userId', { userId });
    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.limit(limit);

    builder.orderBy('blog.updated_at', 'DESC');
    const [blogs, total] = await builder.getManyAndCount();
    const data = plainToInstance(ListBlogOutput, blogs, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: {
        listData: data,
        total,
        totalPage: Math.ceil(total / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getDetail(_id: number): Promise<BaseApiResponse<BlogOutput>> {
    const blog = await this.blogRepository.findOne({
      where: { _id },
      relations: ['user'],
    });

    const data = plainToInstance(BlogOutput, blog, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async approve(data: ApproveBlogInput): Promise<BaseApiResponse<null>> {
    const { _id } = data;
    const exist = await this.blogRepository.findOne({ where: { _id } });

    if (!exist)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    this.blogRepository.merge(exist, data);
    await this.blogRepository.save(exist);

    return {
      error: false,
      data: null,
      message: MESSAGES.APPROVE_BLOG_SUCCESS,
      code: 200,
    };
  }
}
