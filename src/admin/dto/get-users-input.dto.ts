import { IsEnum, IsOptional } from 'class-validator';
import { PaginationParamsDto } from '../../shared/dtos';
import { ROLES } from '../../shared/enums';

export class FilterUserDto extends PaginationParamsDto {
  @IsEnum(ROLES)
  @IsOptional()
  role?: ROLES;
}
