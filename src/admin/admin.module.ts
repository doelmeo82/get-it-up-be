import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../modules/user/user.module';
import { SharedModule } from '../shared/share.module';
import { AuthModule } from '../auth';

@Module({
  imports: [UserModule, SharedModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
