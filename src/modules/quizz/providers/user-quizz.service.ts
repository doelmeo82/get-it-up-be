import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserQuizz } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserQuizzService {
  constructor(
    @InjectRepository(UserQuizz)
    private readonly userQuizzRepository: Repository<UserQuizz>,
  ) {}

  async getUserQuizz(
    userId: string,
    quizzId: number,
    status?: boolean,
  ): Promise<UserQuizz | null> {
    const builder = this.userQuizzRepository
      .createQueryBuilder('userQuizz')
      .leftJoinAndSelect('userQuizz.quizz', 'quizz')
      .andWhere('quizz._id = :quizzId', { quizzId })
      .andWhere('userQuizz.user_id = :userId', { userId });

    if (status) builder.andWhere('userQuizz.status = :status', { status });

    const userQuizz = await builder.getOne();

    return userQuizz;
  }

  async updateStatus(_id: number): Promise<void> {
    await this.userQuizzRepository.update({ _id }, { status: true });
  }
}
