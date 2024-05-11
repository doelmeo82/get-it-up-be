import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubjectGroup {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', {
    nullable: true,
    length: 255,
    name: 'subject_group_name',
  })
  subjectGroupName!: string;

  @Column('int', { nullable: true, name: 'include_subjects', array: true })
  subjects: number[];

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt!: Date;
}
