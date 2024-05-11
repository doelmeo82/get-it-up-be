import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Public, ReqUser } from '../../common';
import { UserOutputDto } from '../../modules/user/dto';
import { UserService } from '../../modules/user/providers';
import { BaseApiResponse } from '../../shared/dtos';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AuthService } from '../auth.service';
import {
  ChangePasswordInput,
  ForgotPassword,
  RefreshTokenInput,
  RegisterInput,
  ResendEmailInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from '../dtos';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { JwtRefreshGuard } from '../guards';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLE_AUTH } from '../constants/strategy.constant';

/**
 * route /auth/*
 */
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async register(
    @Body() body: RegisterInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.authService.register(body);
  }

  @Post('login')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(
    @Body() body: LoginInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.authService.login(body);
  }

  @Get('/login-google')
  @Public()
  @UseGuards(AuthGuard(GOOGLE_AUTH))
  loginGoogle(
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.authService.loginGoogle(ctx);
  }

  @Get('/redirect')
  @Public()
  @UseGuards(AuthGuard(GOOGLE_AUTH))
  googleAuthRedirect(@Request() req: any) {
    return this.authService.googleLogin(req);
  }

  @Post('verify-email')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async verifyEmail(
    @Body() body: VerifyEmailInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.userService.verifyEmail(body);
  }

  @Post('resend-email')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async resendEmail(
    @Body() body: ResendEmailInput,
  ): Promise<BaseApiResponse<null>> {
    return this.authService.resendEmail(body.email);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public async refreshToken(
    @ReqUser() ctx: RequestContext,
    @Body() body: RefreshTokenInput,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.authService.refreshToken(ctx.user.id, body.refreshToken);
  }

  @Post('forgot-password')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async forgotPassword(
    @Body() body: ForgotPassword,
  ): Promise<BaseApiResponse<UserOutputDto>> {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  public async resetPassword(
    @Body() body: ResetPasswordInput,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.resetPassword(body);
  }

  @Post('change-password')
  @UseInterceptors(ClassSerializerInterceptor)
  public async changePassword(
    @ReqUser() ctx: RequestContext,
    @Body() body: ChangePasswordInput,
  ): Promise<BaseApiResponse<null>> {
    return this.userService.changePassword(ctx.user.id, body);
  }
}
