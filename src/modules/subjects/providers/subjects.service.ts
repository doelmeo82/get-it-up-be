import { Injectable } from '@nestjs/common';
import { BaseApiResponse } from '../../../shared/dtos';
import { SubjectOutput } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from '../entities';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { MESSAGES } from 'src/common/constants';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}
  async getSubjects(): Promise<BaseApiResponse<SubjectOutput[]>> {
    const subjects = await this.subjectRepository.find({});

    const result = plainToInstance(SubjectOutput, subjects, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getSubjectByIds(ids: number[]): Promise<SubjectOutput[]> {
    const result = await this.subjectRepository.find({
      where: {
        _id: In(ids),
      },
    });
    return result;
  }
}
