import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam, Question, UserExam } from './entities';
import * as providers from './providers';
import * as controllers from './controllers';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Exam, UserExam]), 
    UserModule,
    CategoryModule
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class ExamModule {}
