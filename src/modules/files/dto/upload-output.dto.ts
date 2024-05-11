import { Expose } from 'class-transformer';

export class UploadOutput {
  @Expose()
  key: string;

  @Expose()
  url: string;
}
