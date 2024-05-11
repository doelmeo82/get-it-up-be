import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Public, ReqUser } from '../../common';
import { BaseApiResponse, BasePaginationResponse } from '../../shared/dtos';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CommentsService } from './comments.service';
import { CommentInput, CommentOutput, FilterCommentInput } from './dto';

@Controller('')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get('/lecture/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCommentByLecture(
    @Param('id') lectureId: number,
    @Query() query: FilterCommentInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<CommentOutput>>> {
    return this.commentService.getCommentByLecture(lectureId, query);
  }

  @Get('/teacher')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async getTeacherEvaluation(
    @Query() query: FilterCommentInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<CommentOutput>>> {
    return this.commentService.getTeacherEvaluation(query);
  }

  @Get('/course/:id')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async getCourseComment(
    @Param('id') courseId: number,
    @Query() query: FilterCommentInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<CommentOutput>>> {
    return this.commentService.getCourseComment(courseId, query);
  }

  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  async comment(
    @ReqUser() ctx: RequestContext,
    @Body() data: CommentInput,
  ): Promise<BaseApiResponse<CommentOutput>> {
    return this.commentService.createComment(ctx.user.id, data);
  }
}
