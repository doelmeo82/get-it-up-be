import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { SubjectsService } from '../providers';
import { BaseApiResponse } from '../../../shared/dtos';
import { SubjectOutput } from '../dto';
import { Public } from '../../../common';
@Controller()
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}

  @Get()
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async getSubjects(): Promise<BaseApiResponse<SubjectOutput[]>> {
    return this.subjectService.getSubjects();
  }
}
