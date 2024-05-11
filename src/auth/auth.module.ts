import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { UserModule } from '../modules/user/user.module';
import * as controllers from './controllers';
import * as strategies from './strategies';
import { PassportModule } from '@nestjs/passport';
import { STRATEGY_JWT_AUTH } from './constants/strategy.constant';
import { HttpModule } from '@nestjs/axios';
import { SharedModule } from 'src/shared/share.module';

@Global()
@Module({
  imports: [
    SharedModule,
    UserModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('jwt.publicKey'),
        privateKey: configService.get<string>('jwt.privateKey'),
        signOptions: {
          algorithm: 'RS256',
          issuer: 'AuthService',
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthSerializer, ...Object.values(strategies)],
  controllers: Object.values(controllers),
  exports: [AuthService],
})
export class AuthModule {}
