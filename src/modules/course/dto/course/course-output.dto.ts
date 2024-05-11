import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { CategoryOutput } from '../../../category/dto';
import { SectionOutput } from '../section/section-output.dto';
import { CartOutput } from '../../../cart/dto/cart-output.dto';
import { UserOutputDto } from '../../../user/dto';

export class CourseOutput {
  @Expose()
  @ApiProperty()
  _id: number;

  @Expose()
  @ApiProperty()
  courseName: string;

  @Expose()
  @ApiProperty()
  thumbnail_url: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  price!: number;

  @Expose()
  totalDuration: number;

  @Expose()
  @ApiProperty()
  expiredDate: Date;

  @Expose()
  @ApiProperty()
  category: CategoryOutput;

  @Type(() => UserOutputDto)
  @Expose()
  teacher: UserOutputDto;

  @Expose()
  @ApiProperty()
  subCategory: CategoryOutput;

  @Expose()
  subCategoryId: number;

  @Expose()
  categoryId: number;

  @Expose()
  isPublic: boolean;

  @Expose()
  @Transform((value) => value.value || false, { toClassOnly: true })
  isPaid: boolean;

  @Expose()
  @Transform((value) => value.value || false, { toClassOnly: true })
  isAddToCart: boolean;

  @Expose()
  @Transform((value) => value.value || false, { toClassOnly: true })
  isBookmark: boolean;

  @Type(() => CartOutput)
  carts: CartOutput[];

  @Expose()
  @Type(() => SectionOutput)
  sections: SectionOutput[];

  @Expose()
  @ApiProperty()
  createdAt!: Date;
}
