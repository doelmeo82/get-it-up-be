import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../modules/user/providers';
import { Roles } from '../common';
import { ROLES } from '../shared/enums';
import { BaseApiResponse, BasePaginationResponse } from '../shared/dtos';
import {
  FilterUserDto,
  GetUsersOutput,
  AdminUpdateUserInput,
  CreateTeacherInput,
} from './dto';
import { AdminService } from './admin.service';

@Controller('')
export class AdminController {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
  ) {}

  @Get('users')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(ROLES.ADMIN)
  async getUsers(
    @Query() filter: FilterUserDto,
  ): Promise<BaseApiResponse<BasePaginationResponse<GetUsersOutput>>> {
    return this.userService.adminGetUsers(filter);
  }

  @Patch('users')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(ROLES.ADMIN)
  async adminUpdateUser(
    @Body() data: AdminUpdateUserInput,
  ): Promise<BaseApiResponse<GetUsersOutput>> {
    return this.userService.adminUpdateUser(data);
  }

  @Post('teachers')
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(ROLES.ADMIN)
  async createTeacher(
    @Body() data: CreateTeacherInput,
  ): Promise<BaseApiResponse<GetUsersOutput>> {
    return this.adminService.createTeacher(data);
  }
}
