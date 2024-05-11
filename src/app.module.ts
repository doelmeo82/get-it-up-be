import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { CommonModule, ExceptionsFilter } from './common';
import { configuration, loggerOptions } from './config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth';
import { SharedModule } from './shared/share.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { AddressModule } from './modules/address/address.module';
import { CategoryModule } from './modules/category/category.module';
import { CourseModule } from './modules/course/course.module';
import { FilesModule } from './modules/files/files.module';
import { ExamModule } from './modules/exam/exam.module';
import { CourseBookmarkModule } from './modules/course-bookmark/course-bookmark.module';
import { CartModule } from './modules/cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './modules/order/order.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { QuizzModule } from './modules/quizz/quizz.module';
import { BlogModule } from './modules/blog/blog.module';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        secure: false,
        auth: {
          user: process.env.EMAIL_ACCOUNT,
          pass: process.env.EMAIL_PASSWORD,
        },
        logger: true,
      },
      template: {
        dir: join(__dirname, './shared/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // https://getpino.io
    // https://github.com/iamolegga/nestjs-pino
    LoggerModule.forRoot(loggerOptions),

    // Database
    // https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
      }),
      inject: [ConfigService],
    }),

    // Static Folder
    // https://docs.nestjs.com/recipes/serve-static
    // https://docs.nestjs.com/techniques/mvc
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../public`,
      renderPath: '/',
    }),
    // Service Modules
    CommonModule, // Global
    SharedModule,
    AuthModule,
    // Module Router
    // https://docs.nestjs.com/recipes/router-module
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'user',
        module: UserModule,
      },
      {
        path: 'address',
        module: AddressModule,
      },
      {
        path: 'subjects',
        module: SubjectsModule,
      },
      {
        path: 'category',
        module: CategoryModule,
      },
      {
        path: 'course',
        module: CourseModule,
      },
      {
        path: 'cart',
        module: CartModule,
      },
      {
        path: 'payment',
        module: PaymentModule,
      },
      {
        path: 'bookmark',
        module: CourseBookmarkModule,
      },
      {
        path: 'exam',
        module: ExamModule,
      },
      {
        path: 'files',
        module: FilesModule,
      },
      {
        path: 'comments',
        module: CommentsModule,
      },
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'quizz',
        module: QuizzModule,
      },
      {
        path: 'blog',
        module: BlogModule,
      },
    ]),
    UserModule,
    SubjectsModule,
    AddressModule,
    CategoryModule,
    CourseModule,
    FilesModule,
    ExamModule,
    CourseBookmarkModule,
    CartModule,
    PaymentModule,
    OrderModule,
    CommentsModule,
    AdminModule,
    QuizzModule,
    BlogModule,
  ],
  providers: [
    // Global Guard, Authentication check on all routers
    // { provide: APP_GUARD, useClass: AuthenticatedGuard },
    // Global Filter, Exception check
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    // Global Pipe, Validation check
    // https://docs.nestjs.com/pipes#global-scoped-pipes
    // https://docs.nestjs.com/techniques/validation
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // disableErrorMessages: true,
        transform: true, // transform object to DTO class
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
