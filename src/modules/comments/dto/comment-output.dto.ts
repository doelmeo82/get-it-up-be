import { Expose, Type } from 'class-transformer';
import { UserOutputDto } from '../../../modules/user/dto';

export class CommentOutput {
  @Expose()
  _id: string;

  @Expose()
  author: string;

  @Expose()
  authorThumbnail: string;

  @Expose()
  likeCount: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;
}
