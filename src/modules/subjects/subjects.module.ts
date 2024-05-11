import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject, SubjectGroup } from './entities';
import * as providers from './providers';
import * as controllers from './controllers';
@Module({
  imports: [TypeOrmModule.forFeature([Subject, SubjectGroup])],
  controllers: Object.values(controllers),
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class SubjectsModule {}
