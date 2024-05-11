import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from '../../../shared/dtos';

export class FilterCommentInput extends PaginationParamsDto {
    @IsString()
    @IsOptional()
    teacherId?: string;
}
