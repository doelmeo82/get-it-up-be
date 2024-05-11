import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quizz, UserQuizz } from '../entities';
import { Repository } from 'typeorm';
import { BaseApiResponse, BasePaginationResponse } from '@/src/shared/dtos';
import {
  CreateQuizzInput,
  FilterQuizzInput,
  QuizzDetailOutput,
  QuizzOutput,
  UpdateQuizzInput,
} from '../dto';
import { QuestionService } from '../../exam/providers';
import { MESSAGES } from '@/src/common/constants';
import { plainToInstance } from 'class-transformer';
import { TakeQuizzInput } from '../dto/take-quizz-input.dto';
import { UserService } from '../../user/providers';
import { TakeQuizzOutput } from '../../course/dto/lecture-quizz-input.dto.ts/take-quizz-output.dto';
import { UserQuizzService } from './user-quizz.service';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz)
    private readonly quizzRepository: Repository<Quizz>,
    private readonly questionService: QuestionService,
    @InjectRepository(UserQuizz)
    private readonly userQuizzRepository: Repository<UserQuizz>,
    private readonly userService: UserService,
    private readonly userQuizzService: UserQuizzService,
  ) {}

  async create(
    teacherId: string,
    data: CreateQuizzInput,
  ): Promise<BaseApiResponse<null>> {
    const { questions } = data;
    const quizz = this.quizzRepository.create(data);
    const includeQuestions = this.questionService.createQuestions(questions);

    await this.quizzRepository.save({
      ...quizz,
      questions: includeQuestions,
      teacherId,
    });

    return {
      error: false,
      data: null,
      code: 201,
      message: MESSAGES.CREATED_SUCCEED,
    };
  }

  async get(
    teacherId: string,
    filter: FilterQuizzInput,
  ): Promise<BaseApiResponse<BasePaginationResponse<QuizzOutput>>> {
    const { limit, page } = filter;
    const builder = this.quizzRepository.createQueryBuilder('quizz');
    builder.andWhere('quizz.teacherId = :teacherId', { teacherId });

    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.take(limit);

    const [quizzs, count] = await builder.getManyAndCount();
    const instance = plainToInstance(QuizzOutput, quizzs, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: {
        listData: instance,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getQuizzById(_id: number): Promise<Quizz | null> {
    return this.quizzRepository.findOne({ where: { _id } });
  }

  async getDetail(
    _id: number,
    userId?: string,
  ): Promise<BaseApiResponse<QuizzDetailOutput>> {
    const quizz = await this.quizzRepository
      .createQueryBuilder('quizz')
      .leftJoinAndSelect('quizz.questions', 'questions')
      .andWhere('quizz._id = :_id', { _id })
      .getOne();

    const instance = plainToInstance(QuizzDetailOutput, quizz, {
      excludeExtraneousValues: true,
    });

    if (userId) {
      const completeQuizz = await this.userQuizzService.getUserQuizz(
        userId,
        _id,
        true,
      );
      instance.isComplete = completeQuizz ? true : false;
    }

    const result = plainToInstance(QuizzDetailOutput, instance);
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async update(
    _id: number,
    data: UpdateQuizzInput,
  ): Promise<BaseApiResponse<null>> {
    const { questions } = data;
    const quizz = await this.quizzRepository.findOne({ where: { _id } });
    if (!quizz)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    this.quizzRepository.merge(quizz, data);
    if (questions) {
      const updateQuestions = await this.questionService.updateQuestions(
        questions,
      );
      quizz.questions = updateQuestions;
    }
    await this.quizzRepository.save(quizz);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  async delete(_id: number, teacherId: string): Promise<BaseApiResponse<null>> {
    const quizz = await this.quizzRepository.findOne({ where: { _id } });
    if (!quizz)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    if (teacherId !== quizz.teacherId)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 403,
        },
        HttpStatus.UNAUTHORIZED,
      );
    await this.quizzRepository.delete({ _id });
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETE_SUCCEED,
      code: 200,
    };
  }

  async studentTakeQuizz(
    userId: string,
    data: TakeQuizzInput,
  ): Promise<BaseApiResponse<TakeQuizzOutput>> {
    const { quizzId, answers } = data;
    const [user, quizz] = await Promise.all([
      this.userService.getUserByUserId(userId),
      this.quizzRepository.findOne({
        where: { _id: quizzId },
        relations: ['questions'],
      }),
    ]);
    if (!user || !quizz)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    const correction = await this.questionService.answerCorrection(
      quizz,
      answers,
    );

    const userQuizz = this.userQuizzRepository.create();
    const created = await this.userQuizzRepository.save({
      ...userQuizz,
      user,
      quizz,
    });

    const isCorrect = correction.every((answer) => answer.status);
    if (isCorrect) await this.userQuizzService.updateStatus(created._id);

    console.log('userQuizz :>> ', userQuizz);
    const result = plainToInstance(TakeQuizzOutput, {
      isCorrect,
      correction,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.FINISH_EXAM,
      code: 200,
    };
  }
}
