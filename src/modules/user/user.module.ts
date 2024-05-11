import { Module } from '@nestjs/common';
import * as providers from './providers';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User } from './entities';
import { UserService } from './providers';
import { CommonModule } from '../../common';
import { AddressModule } from '../address/address.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CommonModule,
    AddressModule,
    TypeOrmModule.forFeature([User, Permission, Role]),
    CategoryModule,
  ],
  controllers: [UserController],
  providers: Object.values(providers),
  exports: [UserService],
})
export class UserModule {}
