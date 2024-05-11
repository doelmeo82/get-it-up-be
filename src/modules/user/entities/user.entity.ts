import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from '../../../modules/address/entities';
import { Cart } from '../../../modules/cart/entities/cart.entity';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { CourseBookmark } from '../../../modules/course-bookmark/entities';
import { UserExam } from '../../../modules/exam/entities';
import { Order } from '../../../modules/order/entities/order.entity';
import { Role } from './';
import { UserQuizz } from '../../quizz/entities';
import { UserCourse } from '../../course/entities/user-course.entity';
import { Blog } from '../../blog/entities/blog.entity';
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id!: string;

  @Column('varchar', { nullable: true, length: 255, name: 'fullname' })
  fullname!: string;

  @Column('varchar', { nullable: false, length: 255, name: 'email' })
  email!: string;

  @Column('varchar', { nullable: true, length: 255, name: 'username' })
  username?: string;

  @Column('varchar', { nullable: false, length: 255, name: 'password' })
  password!: string;

  @Column('varchar', { nullable: true, length: 255, name: 'phone' })
  phone?: string;

  @Column('boolean', { nullable: true, name: 'gender' })
  gender?: boolean;

  @Column('date', { nullable: true, name: 'birth_date' })
  birthDate?: Date;

  @Column('int', { nullable: true, name: 'grade_id' })
  grade?: number;

  @Column('int', { nullable: true, name: 'preferred_subjects', array: true })
  subjects: number[];

  @Column('int', { nullable: true, name: 'subject_group_id' })
  subjectGroup: number;

  @Column('boolean', {
    nullable: false,
    name: 'is_verify_email',
    default: false,
  })
  isVerifyEmail!: boolean;

  @Column('boolean', {
    nullable: false,
    name: 'is_disabled',
    default: false,
  })
  isDisabled!: boolean;

  @Column('boolean', {
    nullable: false,
    name: 'is_deteled',
    default: false,
  })
  isDeleted!: boolean;

  @Column('text', { nullable: true, name: 'memo' })
  memo: string;

  @Column('varchar', { nullable: true, name: 'email_verify_code', length: 255 })
  emailVerifyCode?: string | null;

  @Column('varchar', { nullable: true, name: 'refresh_token' })
  refreshToken?: string;

  @Column('text', { nullable: true, name: 'avatar' })
  avatar?: string;

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

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToOne(() => Address, (address) => address.user, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => UserExam, (userExam) => userExam.user)
  exams: UserExam[];

  @OneToMany(() => UserQuizz, (userQuizz) => userQuizz.user)
  quizzs: UserQuizz[];

  @OneToMany(() => CourseBookmark, (bookmark) => bookmark.user)
  bookmarks: CourseBookmark[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => UserCourse, (userCourse) => userCourse.user)
  userCourses: UserCourse[];

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];
}
