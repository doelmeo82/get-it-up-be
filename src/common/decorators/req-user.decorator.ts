import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { createRequestContext } from 'src/shared/utils/context.util';

export const ReqUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestContext => {
    let request: Request;

    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      request = <Request>ctx.req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    return createRequestContext(request);
  },
);
