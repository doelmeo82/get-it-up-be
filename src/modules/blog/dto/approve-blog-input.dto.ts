import { BLOG_STATUS } from '@/src/shared/enums';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApproveBlogInput {
  @IsNumber()
  @IsNotEmpty()
  _id: number;

  @IsEnum(BLOG_STATUS)
  @IsNotEmpty()
  status: BLOG_STATUS;

  @IsString()
  @IsOptional()
  declineReason?: string;
}
