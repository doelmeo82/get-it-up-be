import { Expose } from 'class-transformer';

export class SubjectOutput {
  @Expose()
  _id: number;

  @Expose()
  subjectName: string;
}
