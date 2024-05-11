import { IsNotEmpty, IsString } from 'class-validator';

export class UploadVideoInput {
  @IsNotEmpty()
  @IsString()
  slug: string;
}
