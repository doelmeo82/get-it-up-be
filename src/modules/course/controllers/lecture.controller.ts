import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { LectureService } from '../providers';
import { Public, ReqUser } from '../../../common';
import { RequestContext } from '../../../shared/request-context/request-context.dto';
import { Response } from 'express';

@Controller('')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get('/lecture/:slug')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async getLectureVideo(
    @ReqUser() ctx: RequestContext,
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.lectureService.getLectureVideo(ctx, slug, res);
  }
}
