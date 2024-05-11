import { User } from '../../../modules/user/entities';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('integer', { nullable: true, name: 'province' })
  province: number;

  @Column('integer', { nullable: true, name: 'district' })
  district: number;

  @Column('text', { nullable: true, name: 'detail' })
  detail: string;

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

  @OneToOne(() => User, (user) => user.address)
  user: User;
}
