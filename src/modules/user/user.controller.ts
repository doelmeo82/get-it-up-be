import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ReqUser } from '../../common';
import { BaseApiResponse } from '../../shared/dtos';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UpdateUserInput, UserOutputDto } from './dto';
import { UserService } from './providers';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current-user')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getCurrentUser(
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.userService.getCurrentUser(ctx.user.id);
  }

  @Put('/info')
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateUser(
    @ReqUser() ctx: RequestContext,
    @Body() data: UpdateUserInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.userService.updateProfile(ctx.user.id, data);
  }
}
