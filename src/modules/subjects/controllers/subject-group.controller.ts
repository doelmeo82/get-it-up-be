import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { SubjectGroupService } from '../providers/subject-group.service';
import { BaseApiResponse } from '../../../shared/dtos';
import { SubjectGroupOutput } from '../dto/subject-group-output.dto';

@Controller()
export class SubjectGroupController {
  constructor(private readonly subjectGroupService: SubjectGroupService) {}

  @Get('/group')
  @UseInterceptors(ClassSerializerInterceptor)
  async getSubjects(): Promise<BaseApiResponse<SubjectGroupOutput[]>> {
    return this.subjectGroupService.getSubjectGroup();
  }
}
