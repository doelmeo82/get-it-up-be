import { BLOG_STATUS } from '@/src/shared/enums';
import { Expose, Type } from 'class-transformer';
import { UserOutputDto } from '../../user/dto';

export class BlogOutput {
  @Expose()
  _id: number;

  @Expose()
  title: string;

  @Expose()
  tags: string[];

  @Expose()
  content: string;

  @Expose()
  previewContent: string;

  @Expose()
  status: BLOG_STATUS;

  @Type(() => UserOutputDto)
  @Expose()
  user: UserOutputDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class ListBlogOutput {
  @Expose()
  _id: number;

  @Expose()
  title: string;

  @Expose()
  tags: string[];

  @Expose()
  previewContent: string;

  @Expose()
  status: BLOG_STATUS;

  @Type(() => UserOutputDto)
  @Expose()
  user: UserOutputDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
