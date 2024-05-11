import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CategoryOutput {
  @Expose()
  @ApiProperty()
  public _id: number;

  @Expose()
  @ApiProperty()
  public categoryName: string;

  @Expose()
  @ApiProperty()
  public description: string;

  @Expose()
  @ApiProperty()
  @Type(() => CategoryOutput)
  public childs: CategoryOutput[];

  @Expose()
  @ApiProperty()
  @Type(() => CategoryOutput)
  public category: CategoryOutput;
}
