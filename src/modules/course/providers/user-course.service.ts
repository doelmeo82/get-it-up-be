import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities';
import { Course, UserCourse } from '../entities';

@Injectable()
export class UserCourseService {
  constructor(
    @InjectRepository(UserCourse)
    private readonly userCourseRepository: Repository<UserCourse>,
  ) {}

  async create(course: Course, user: User): Promise<UserCourse> {
    const created = this.userCourseRepository.create({
      user,
      course: course,
    });
    await this.userCourseRepository.save(created);

    return created;
  }
}
