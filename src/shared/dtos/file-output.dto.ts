import { Expose } from 'class-transformer';

export class FileOutput {
  @Expose()
  public name: string;

  @Expose()
  public alt: string;

  @Expose()
  public src: string;

  @Expose()
  public location: string;
}
