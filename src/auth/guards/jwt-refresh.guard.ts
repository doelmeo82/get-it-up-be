import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { STRATEGY_JWT_REFRESH } from '../constants/strategy.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_JWT_REFRESH) {
  public getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return <Request>ctx.req;
    }

    return context.switchToHttp().getRequest<Request>();
  }
}
