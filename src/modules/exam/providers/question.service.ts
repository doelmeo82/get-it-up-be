import { Repository } from 'typeorm';
import { Question } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AnswerQuestionInput,
  CreateQuestionDto,
  ExamDetailOutput,
} from '../dto';
import { UpdateQuestionDto } from '../dto/update-question-input.dto';
import { QuestionCorrectionOutput } from '../dto/question-output.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { QuizzDetailOutput } from '../../quizz/dto';
import { Quizz } from '../../quizz/entities';

export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async getQuestionById(_id: number): Promise<Question | null> {
    const result = await this.questionRepository.findOneBy({ _id });
    return result;
  }

  createQuestions(data: CreateQuestionDto[]): Question[] {
    const questions: Question[] = [];
    data.map((question) => {
      const createQuestion = this.questionRepository.create(question);
      questions.push(createQuestion);
    });

    return questions;
  }

  async updateQuestions(data: UpdateQuestionDto[]): Promise<Question[]> {
    const bulkQuestions: Question[] = [];
    await Promise.all(
      data.map(async (question) => {
        if (question.id) {
          const exist = await this.questionRepository.findOne({
            where: { _id: question.id },
          });
          if (exist) {
            this.questionRepository.merge(exist, question);
            bulkQuestions.push(exist);
          }
        } else {
          const newQuestion = this.questionRepository.create(question);
          bulkQuestions.push(newQuestion);
        }
      }),
    );
    return bulkQuestions;
  }

  async answerCorrection(
    exam: ExamDetailOutput | QuizzDetailOutput | Quizz,
    data: AnswerQuestionInput[],
  ): Promise<QuestionCorrectionOutput[]> {
    const output: QuestionCorrectionOutput[] = [];
    const questions = exam.questions;
    const selected = data.filter((e) => e.questionId !== 0);
    selected.map((ans) => {
      const { questionId, answer } = ans;
      const question = questions.find((e) => e._id === questionId);
      if (question) {
        const isCorrect =
          JSON.stringify(question.correctAnswers) === JSON.stringify(answer);

        const instance = plainToInstance(QuestionCorrectionOutput, question, {
          excludeExtraneousValues: true,
        });
        const result = plainToInstance(
          QuestionCorrectionOutput,
          instanceToPlain({
            ...instance,
            status: isCorrect,
            question,
            studentAnswer: answer,
          }),
        );
        output.push(result);
        // remove the selected after correction
        const index = questions.findIndex((q) => q._id === question._id);
        questions.splice(index, 1);
      }
    });
    // unselected
    questions.map((unselect) => {
      const instance = plainToInstance(QuestionCorrectionOutput, unselect, {
        excludeExtraneousValues: true,
      });
      instance.status = false;
      instance.question = unselect;
      const result = plainToInstance(
        QuestionCorrectionOutput,
        instanceToPlain({
          ...instance,
          status: false,
          question: unselect,
        }),
      );
      output.push(result);
    });
    return output;
  }
}
