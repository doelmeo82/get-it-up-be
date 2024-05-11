import { Public, ReqUser, Roles } from '@/src/common';
import { BaseApiResponse, BasePaginationResponse } from '@/src/shared/dtos';
import { ROLES } from '@/src/shared/enums';
import { RequestContext } from '@/src/shared/request-context/request-context.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateQuizzInput,
  FilterQuizzInput,
  QuizzDetailOutput,
  QuizzOutput,
  UpdateQuizzInput,
} from '../dto';
import { QuizzService } from '../providers/quizz.service';

@Controller('')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Post('/teacher/create')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async createExam(
    @ReqUser() ctx: RequestContext,
    @Body() data: CreateQuizzInput,
  ): Promise<BaseApiResponse<null>> {
    return this.quizzService.create(ctx.user.id, data);
  }

  @Get('/teacher/my-quizz')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async teacherGetQuizz(
    @ReqUser() ctx: RequestContext,
    @Query() filter: FilterQuizzInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<QuizzOutput>>> {
    return this.quizzService.get(ctx.user.id, filter);
  }

  @Patch('/teacher/update/:id')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateExam(
    @Param('id') id: number,
    @Body() data: UpdateQuizzInput,
  ): Promise<BaseApiResponse<null>> {
    return this.quizzService.update(id, data);
  }

  @Delete('/:id')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteQuizz(
    @Param('id') id: number,
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.quizzService.delete(id, ctx.user.id);
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @Public()
  async getQuizzDetail(
    @ReqUser() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<QuizzDetailOutput>> {
    return this.quizzService.getDetail(id, ctx?.user?.id);
  }
}
