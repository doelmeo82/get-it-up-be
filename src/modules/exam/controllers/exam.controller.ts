import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BaseApiResponse, BasePaginationResponse } from 'src/shared/dtos';
import { Public, ReqUser, Roles } from '../../../common/decorators';
import { ROLES } from '../../../shared/enums';
import { RequestContext } from '../../../shared/request-context/request-context.dto';
import {
  CreateExamDto,
  ExamDetailOutput,
  FilterExamDto,
  FilterExamOutput,
  TakeExamInput,
  TakeExamOutput,
  UpdateExamDto,
} from '../dto';
import {
  ExamRankingFilter,
  ExamRankingOutput,
} from '../dto/exam-rank-filter.dto';
import { ExamService } from '../providers';

@Controller('')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('/teacher/create')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async createExam(
    @ReqUser() ctx: RequestContext,
    @Body() data: CreateExamDto,
  ): Promise<BaseApiResponse<null>> {
    return this.examService.createExam(ctx.user.id, data);
  }

  @Get('/teacher/my-exam')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async teacherGetExam(
    @ReqUser() ctx: RequestContext,
    @Query() filter: FilterExamDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<FilterExamOutput>>> {
    return this.examService.teacherGetExam(ctx.user.id, filter);
  }

  @Get('/ranking')
  @UseInterceptors(ClassSerializerInterceptor)
  async getExamRanking(
    @ReqUser() ctx: RequestContext,
    @Query() query: ExamRankingFilter,
  ): Promise<BaseApiResponse<BasePaginationResponse<ExamRankingOutput>>> {
    const userId = ctx.user.id;
    return this.examService.getExamRanking(query, userId);
  }

  @Get('/:id')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async getExamDetail(
    @Param('id') id: number,
  ): Promise<BaseApiResponse<ExamDetailOutput>> {
    return this.examService.getExamDetail(id);
  }

  @Put('/teacher/update/:id')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateExam(
    @Param('id') id: number,
    @Body() data: UpdateExamDto,
  ): Promise<BaseApiResponse<null>> {
    return this.examService.updateExam(id, data);
  }

  @Delete('/:id')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteExam(
    @Param('id') id: number,
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<null>> {
    return this.examService.deleteExam(id, ctx.user.id);
  }

  @Post('/student/take-exam')
  @Roles(ROLES.STUDENT)
  @UseInterceptors(ClassSerializerInterceptor)
  async takeExam(
    @ReqUser() ctx: RequestContext,
    @Body() data: TakeExamInput,
  ): Promise<BaseApiResponse<TakeExamOutput>> {
    return this.examService.studentTakeExam(ctx.user.id, data);
  }
}
