import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { MESSAGES } from '../../../common/constants';
import { UserService } from '../../../modules/user/providers';
import { BaseApiResponse, BasePaginationResponse } from '../../../shared/dtos';
import { groupRankingByUser } from '../../../shared/utils/array.util';
import { correctionResult } from '../../../shared/utils/correction.util';
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
import { Exam, UserExam } from '../entities';
import { QuestionService } from './question.service';
import { CategoryService } from '../../../modules/category/category.service';
import { CategoryOutput } from '../../../modules/category/dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(UserExam)
    private readonly userExamRepository: Repository<UserExam>,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async createExam(
    teacherId: string,
    data: CreateExamDto,
  ): Promise<BaseApiResponse<null>> {
    const { questions } = data;
    const exam = this.examRepository.create(data);
    const includeQuestions = this.questionService.createQuestions(questions);

    await this.examRepository.save({
      ...exam,
      questions: includeQuestions,
      teacherId,
    });
    return {
      error: false,
      data: null,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }

  async getExamDetail(_id: number): Promise<BaseApiResponse<ExamDetailOutput>> {
    const exam = await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.questions', 'questions')
      .andWhere('exam._id = :_id', { _id })
      .getOne();

    const result = plainToInstance(ExamDetailOutput, exam, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async teacherGetExam(
    teacherId: string,
    filter: FilterExamDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<FilterExamOutput>>> {
    const { categoryId, subCategoryId, limit, page } = filter;
    const builder = this.examRepository.createQueryBuilder('exam');
    builder.andWhere('exam.teacherId = :teacherId', { teacherId });

    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.take(limit);
    if (categoryId)
      builder.andWhere('exam.categoryId = :categoryId', { categoryId });
    if (subCategoryId)
      builder.andWhere('exam.subCategoryId = :subCategoryId', {
        subCategoryId,
      });
    const [exams, count] = await builder.getManyAndCount();
    const instance = plainToInstance(FilterExamOutput, exams, {
      excludeExtraneousValues: true,
    });
    await Promise.all(
      instance.map(async (exam) => {
        const [category, subCategory] = await Promise.all([
          this.categoryService.getCategoryById(exam.categoryId),
          this.categoryService.getCategoryById(exam.subCategoryId),
        ]);
        exam.category = plainToInstance(CategoryOutput, category);
        exam.subCategory = plainToInstance(CategoryOutput, subCategory);
      }),
    );
    const result = plainToInstance(FilterExamOutput, instance, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: {
        listData: result,
        total: count,
        totalPage: Math.ceil(count / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async updateExam(
    _id: number,
    data: UpdateExamDto,
  ): Promise<BaseApiResponse<null>> {
    const { questions } = data;
    const exam = await this.examRepository.findOne({ where: { _id } });
    if (!exam)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    this.examRepository.merge(exam, data);
    if (questions) {
      const updateQuestions = await this.questionService.updateQuestions(
        questions,
      );
      exam.questions = updateQuestions;
    }
    await this.examRepository.save(exam);
    return {
      error: false,
      data: null,
      message: MESSAGES.UPDATE_SUCCEED,
      code: 200,
    };
  }

  async deleteExam(
    _id: number,
    teacherId: string,
  ): Promise<BaseApiResponse<null>> {
    const exam = await this.examRepository.findOne({ where: { _id } });
    if (!exam)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    if (teacherId !== exam.teacherId)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 403,
        },
        HttpStatus.UNAUTHORIZED,
      );
    await this.examRepository.delete({ _id });
    return {
      error: false,
      data: null,
      message: MESSAGES.DELETE_SUCCEED,
      code: 200,
    };
  }

  async studentTakeExam(
    userId: string,
    data: TakeExamInput,
  ): Promise<BaseApiResponse<TakeExamOutput>> {
    const { completeTime, examId, answers } = data;
    const [user, exam] = await Promise.all([
      this.userService.getUserByUserId(userId),
      this.examRepository.findOne({
        where: { _id: examId },
        relations: ['questions'],
      }),
    ]);
    if (!user || !exam)
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
      exam,
      answers,
    );
    const userExam = this.userExamRepository.create(data);
    const examResult = correctionResult(exam, answers, correction);

    const { corrects, totalQuestions, score } = examResult;
    await this.userExamRepository.save({
      ...userExam,
      user,
      exam,
      corrects,
      totalQuestions,
      score,
    });
    const result = plainToInstance(TakeExamOutput, {
      ...examResult,
      completeTime,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.FINISH_EXAM,
      code: 200,
    };
  }

  async getExamRanking(
    query: ExamRankingFilter,
    userId: string,
  ): Promise<BaseApiResponse<BasePaginationResponse<ExamRankingOutput>>> {
    console.log(userId);
    const { examId, page, limit } = query;
    const builder = this.userExamRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.user', 'user')
      .andWhere('result.exam_id = :exam_id', { exam_id: examId });

    if (page) builder.skip((page - 1) * limit);
    if (limit) builder.take(limit);
    builder.addOrderBy('result.score', 'DESC');
    builder.addOrderBy('result.completeTime');
    const exam = await builder.getMany();

    const instance = plainToInstance(ExamRankingOutput, exam, {
      excludeExtraneousValues: true,
    });
    const groupedRanking = groupRankingByUser(instance);
    const result = Object.values(groupedRanking);
    return {
      error: false,
      data: {
        listData: result,
        total: result.length,
        totalPage: Math.ceil(result.length / limit),
      },
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }
}
