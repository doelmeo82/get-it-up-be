import { OrderDetail } from '../../order/entities/order-detail.entity';
import { Course } from '../../../modules/course/entities';
import { User } from '../../../modules/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('decimal', {
    nullable: false,
    name: 'discount',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  discount: number;

  @Column('boolean', { name: 'status', nullable: false, default: false })
  status: boolean;

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

  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, (course) => course.cart)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => OrderDetail, (detail) => detail.cart, {})
  orderDetails: OrderDetail[];
}
