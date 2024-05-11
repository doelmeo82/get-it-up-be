import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../modules/user/entities';
import { PAYMENT_METHOD } from '../../../shared/enums';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment')
  _id!: number;

  @Column('decimal', { name: 'total', default: 0.0 })
  total: number;

  @Column('boolean', { name: 'payment_status', default: true })
  paymentStatus: boolean;

  @Column({
    type: 'enum',
    enum: PAYMENT_METHOD,
    name: 'payment_method',
    default: PAYMENT_METHOD.VNPAY,
  })
  paymentMethod: PAYMENT_METHOD;

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

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: ['insert', 'update', 'remove'],
    orphanedRowAction: 'delete',
  })
  orderDetails: OrderDetail[];
}
