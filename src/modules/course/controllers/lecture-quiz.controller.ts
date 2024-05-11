import { ReqUser, Roles } from '@/src/common';
import { BaseApiResponse } from '@/src/shared/dtos';
import { ROLES } from '@/src/shared/enums';
import { RequestContext } from '@/src/shared/request-context/request-context.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TakeQuizzInput } from '../../quizz/dto/take-quizz-input.dto';
import { QuizzService } from '../../quizz/providers';
import { TakeQuizzOutput } from '../dto/lecture-quizz-input.dto.ts/take-quizz-output.dto';
import { LectureQuizzOutput } from '../dto/lecture/lecture-quizz-output.dto';
import { LectureQuizzService } from '../providers';

@Controller('')
export class LectureQuizzController {
  constructor(
    private readonly lectureQuizzService: LectureQuizzService,
    private readonly quizzSerice: QuizzService,
  ) {}

  @Get('/quizz/lecture/:id')
  async getLectureQuizz(
    @ReqUser() ctx: RequestContext,
    @Param('id') lectureId: number,
  ): Promise<BaseApiResponse<LectureQuizzOutput[]>> {
    return this.lectureQuizzService.getLectureQuizz(lectureId, ctx.user.id);
  }

  @Post('/quizz/take-quizz')
  @Roles(ROLES.STUDENT)
  @UseInterceptors(ClassSerializerInterceptor)
  async takeExam(
    @ReqUser() ctx: RequestContext,
    @Body() data: TakeQuizzInput,
  ): Promise<BaseApiResponse<TakeQuizzOutput>> {
    return this.quizzSerice.studentTakeQuizz(ctx.user.id, data);
  }
}
