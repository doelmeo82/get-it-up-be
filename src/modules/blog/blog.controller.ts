import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public, ReqUser, Roles } from '@/src/common';
import {
  ApproveBlogInput,
  BlogOutput,
  CreateBlogInput,
  FilterBlogInput,
  ListBlogOutput,
  UpdateBlogInput,
} from './dto';
import { BaseApiResponse, BasePaginationResponse } from '@/src/shared/dtos';
import { RequestContext } from '@/src/shared/request-context/request-context.dto';
import { ROLES } from '@/src/shared/enums';

@Controller('')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  async create(
    @ReqUser() ctx: RequestContext,
    @Body() data: CreateBlogInput,
  ): Promise<BaseApiResponse<null>> {
    return this.blogService.create(ctx.user.id, data);
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateBlogInput,
  ): Promise<BaseApiResponse<BlogOutput>> {
    return this.blogService.update(id, data);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: number): Promise<BaseApiResponse<null>> {
    return this.blogService.delete(id);
  }

  @Public()
  @Get('list')
  async get(
    @Query() filter: FilterBlogInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<ListBlogOutput>>> {
    return this.blogService.getList(filter);
  }

  @Public()
  @Get('my-blog')
  async getMyBlog(
    @ReqUser() ctx: RequestContext,
    @Query() filter: FilterBlogInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<ListBlogOutput>>> {
    return this.blogService.getMyBlogs(ctx?.user?.id, filter);
  }

  @Public()
  @Get('/detail/:id')
  async getDetail(
    @Param('id') id: number,
  ): Promise<BaseApiResponse<BlogOutput>> {
    return this.blogService.getDetail(id);
  }

  @Post('/approve')
  @Roles(ROLES.ADMIN)
  async approveBlog(
    @Body() data: ApproveBlogInput,
  ): Promise<BaseApiResponse<null>> {
    return this.blogService.approve(data);
  }
}
