import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, Lecture, LectureQuizz, Section } from './entities';
import * as providers from './providers';
import * as controllers from './controllers';
import { UserModule } from '../user/user.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { CategoryModule } from '../category/category.module';
import { CartModule } from '../cart/cart.module';
import { CourseBookmarkModule } from '../course-bookmark/course-bookmark.module';
import { OrderModule } from '../order/order.module';
import { FilesModule } from '../files/files.module';
import { QuizzModule } from '../quizz/quizz.module';
import { UserCourse } from './entities/user-course.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Section,
      Lecture,
      LectureQuizz,
      UserCourse,
    ]),
    UserModule,
    SubjectsModule,
    CategoryModule,
    FilesModule,
    QuizzModule,
    forwardRef(() => CartModule),
    forwardRef(() => CourseBookmarkModule),
    forwardRef(() => OrderModule),
  ],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class CourseModule {}
