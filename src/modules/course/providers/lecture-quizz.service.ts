import { MESSAGES } from '@/src/common/constants';
import { BaseApiResponse } from '@/src/shared/dtos';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { QuizzService } from '../../quizz/providers/quizz.service';
import { CreateLectureQuizzInput } from '../dto/lecture-quizz-input.dto.ts/create-lecture-quizz-input.dto';
import { LectureQuizzOutput } from '../dto/lecture/lecture-quizz-output.dto';
import { LectureQuizz } from '../entities';

@Injectable()
export class LectureQuizzService {
  constructor(
    @InjectRepository(LectureQuizz)
    private readonly lectureQuizzRepository: Repository<LectureQuizz>,
    private readonly quizzSerice: QuizzService,
  ) {}

  create(data: CreateLectureQuizzInput[]): LectureQuizz[] {
    const bulkQuizz: LectureQuizz[] = [];
    if (!data) return bulkQuizz;
    data.map((quizz) => {
      const createQuizz = this.lectureQuizzRepository.create(quizz);
      bulkQuizz.push(createQuizz);
    });

    return bulkQuizz;
  }

  async getLectureQuizz(
    lectureId: number,
    userId: string,
  ): Promise<BaseApiResponse<LectureQuizzOutput[]>> {
    const quizz = await this.lectureQuizzRepository
      .createQueryBuilder('lectureQuizz')
      .andWhere('lectureQuizz.lecture_id = :lectureId', { lectureId })
      .getMany();

    const instance = plainToInstance(LectureQuizzOutput, quizz, {
      excludeExtraneousValues: true,
    });

    await Promise.all(
      instance.map(async (item) => {
        const quizz = await this.quizzSerice.getDetail(item.quizzId, userId);
        item.quizz = quizz.data;
      }),
    );
    const result = plainToInstance(LectureQuizzOutput, instance);

    return {
      error: false,
      data: result,
      code: 200,
      message: MESSAGES.GET_SUCCEED,
    };
  }
}
