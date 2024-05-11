import { MESSAGES } from '@/src/common/constants/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ContextService {
  constructor(private readonly jwt: JwtService) {}

  // Get user from headers
  getUserFromHeader = (author?: string): string => {
    const token = author?.split('Bearer ')[1];
    if (!token)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.UNAUTHORIZED,
          code: 401,
        },
        HttpStatus.UNAUTHORIZED,
      );
    const payload = <{ sub: string }>this.jwt.decode(token);

    return payload.sub;
  };
}
