import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Public, Roles } from '../../common';
import { BaseApiResponse } from '../../shared/dtos';
import { ROLES } from '../../shared/enums';
import { CategoryService } from './category.service';
import { CategoryOutput, CreateCategory } from './dto';
import { FilterCategoryInput } from './dto/filter-category-input.dto';

@Controller('')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/admin')
  @Roles(ROLES.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async createCategory(
    @Body() data: CreateCategory,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return this.categoryService.create(data);
  }

  @Get('')
  @Public()
  async getCategory(): Promise<BaseApiResponse<CategoryOutput[]>> {
    return this.categoryService.getCategory();
  }

  @Get('/categoryId')
  @Public()
  async getCategoryById(
    @Query() query: FilterCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    return this.categoryService.filterCategory(query);
  }
}
