import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamModule } from '../exam/exam.module';
import { UserModule } from '../user/user.module';
import * as controllers from './controllers';
import { Quizz, UserQuizz } from './entities';
import * as providers from './providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quizz, UserQuizz]),
    ExamModule,
    UserModule,
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class QuizzModule {}
