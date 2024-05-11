import { Expose } from 'class-transformer';
import { SubjectOutput } from './subject-output.dto';

export class SubjectGroupOutput {
  @Expose()
  _id: number;

  @Expose()
  subjectGroupName: string;

  @Expose()
  listSubjects: SubjectOutput[];

  @Expose()
  subjects: number[];
}
