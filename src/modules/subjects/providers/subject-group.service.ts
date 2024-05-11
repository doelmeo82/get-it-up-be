import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { MESSAGES } from 'src/common/constants';
import { Repository } from 'typeorm';
import { BaseApiResponse } from '../../../shared/dtos';
import { SubjectOutput } from '../dto';
import { SubjectGroupOutput } from '../dto/subject-group-output.dto';
import { SubjectGroup } from '../entities';
import { SubjectsService } from './subjects.service';

@Injectable()
export class SubjectGroupService {
  constructor(
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupRepository: Repository<SubjectGroup>,
    private readonly subjectService: SubjectsService,
  ) {}
  async getSubjectGroup(): Promise<BaseApiResponse<SubjectGroupOutput[]>> {
    const subjectGroups = await this.subjectGroupRepository.find({});
    const instance = plainToInstance(SubjectGroupOutput, subjectGroups, {
      excludeExtraneousValues: true,
    });

    const subjectIds = instance.reduce((accumulator, currentValue) => {
      const subjects = currentValue.subjects || [];
      return [...accumulator, ...subjects];
    }, [] as number[]);
    const subjects = await this.subjectService.getSubjectByIds(subjectIds);
    instance.forEach((value) => {
      const listSubjects = value.subjects || [];
      value.listSubjects = subjects
        .filter((subject) => listSubjects.includes(+subject._id))
        .map((subject) => plainToInstance(SubjectOutput, subject));
    });
    const result = plainToInstance(SubjectGroupOutput, instance, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }
}
