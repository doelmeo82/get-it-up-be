import { IsNotEmpty, IsString } from 'class-validator';

export class SubscribeNotiInput {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
