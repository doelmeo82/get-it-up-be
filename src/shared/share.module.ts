import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../common';
import { HttpModule } from '@nestjs/axios';
import * as providers from './providers';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule,
    CommonModule,
    HttpModule,
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
  providers: Object.values(providers),
  exports: Object.values(providers),
})
export class SharedModule {}
