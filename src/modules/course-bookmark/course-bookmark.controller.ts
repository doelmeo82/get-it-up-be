import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CourseBookmarkService } from './course-bookmark.service';
import { ReqUser } from '../../common';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { BaseApiResponse } from '../../shared/dtos';
import { BookmarkCourseDto } from './dto/create-course-bookmark.dto';
import { BookmarkOuput } from './dto';

@Controller('')
export class CourseBookmarkController {
  constructor(private readonly bookmarkService: CourseBookmarkService) {}

  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  async bookmarkCourse(
    @Body() data: BookmarkCourseDto,
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.bookmarkService.bookmarkCourse(data, ctx.user.id);
  }

  @Get('/my-list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUserBookmarks(
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<BookmarkOuput[]>> {
    return this.bookmarkService.getUserBookmarks(ctx.user.id);
  }
}
