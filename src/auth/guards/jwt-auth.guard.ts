import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from '../constants/strategy.constant';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      if (token) {
        return super.canActivate(context);
      }
      return true;
    }
    return super.canActivate(context);
  }

  private extractToken(request: any): string | null {
    // Extract token from the request, modify this based on your token extraction logic
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.slice(7);
    }
    return null;
  }
}
