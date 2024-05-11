import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/providers';
import { CreateTeacherInput, GetUsersOutput } from './dto';
import { BaseApiResponse } from '../shared/dtos';
import { plainToInstance } from 'class-transformer';
import { MESSAGES } from '../common/constants';
import { AuthService } from '../auth';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly authSerivce: AuthService,
  ) {}

  async createTeacher(
    data: CreateTeacherInput,
  ): Promise<BaseApiResponse<GetUsersOutput>> {
    const created = await this.userService.create(data);
    const jwt = this.authSerivce.generateToken(created);
    this.authSerivce.sendTeacherAccountEmail(created, data.password);

    await this.userService.update(created._id, {
      refreshToken: jwt.refreshToken,
      isVerifyEmail: true,
    });
    const result = plainToInstance(GetUsersOutput, created, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }
}
