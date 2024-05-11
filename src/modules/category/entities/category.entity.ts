import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('varchar', { nullable: false, name: 'category_name' })
  categoryName!: string;

  @Column('text', { nullable: true, name: 'description' })
  description: string;

  @OneToMany(() => Category, (category) => category.category)
  childs: Category[];

  @ManyToOne(() => Category, (category) => category.childs)
  category: Category;

  @Column('int', { name: 'list_courses', nullable: true, array: true })
  courses: number[];

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
