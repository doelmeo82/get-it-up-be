import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { MESSAGES } from '../../common/constants';
import { BaseApiResponse } from '../../shared/dtos';
import { CategoryOutput, CreateCategory } from './dto';
import { Category } from './entities';
import { FilterCategoryInput } from './dto/filter-category-input.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategoryById(id: number): Promise<CategoryOutput> {
    const builder = this.categoryRepository.createQueryBuilder('category');
    builder.andWhere('category._id = :id', { id });
    const result = await builder.getOne();
    return plainToInstance(CategoryOutput, result, {
      excludeExtraneousValues: true,
    });
  }

  async filterCategory(
    query: FilterCategoryInput,
  ): Promise<BaseApiResponse<CategoryOutput>> {
    const { categoryId, subCategoryId } = query;
    const builder = this.categoryRepository.createQueryBuilder('category');
    if (categoryId) {
      builder.andWhere('category.category_id IS NULL');
      builder.leftJoinAndSelect('category.childs', 'childs');
      builder.addOrderBy('childs._id');
      builder.andWhere('category._id = :_id', { _id: categoryId });
    } else {
      builder.andWhere('category.category_id IS NOT NULL');
      builder.andWhere('category._id = :_id', { _id: subCategoryId });
    }
    builder.orderBy('category.categoryName');
    const category = await builder.getOne();
    const result = plainToInstance(CategoryOutput, category, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async getSubCategory(
    names: string[],
    parentId: number,
  ): Promise<CategoryOutput[]> {
    const subCategories = await this.categoryRepository
      .createQueryBuilder('subCategory')
      .andWhere('subCategory.categoryName IN (:...names)', { names })
      .andWhere('subCategory.category_id = :id', { id: parentId })
      .getMany();

    const result = plainToInstance(CategoryOutput, subCategories, {
      excludeExtraneousValues: true,
    });
    return result;
  }

  async getCategory(): Promise<BaseApiResponse<CategoryOutput[]>> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .andWhere('category.category_id IS NULL')
      .leftJoinAndSelect('category.childs', 'childs')
      .orderBy('category.categoryName')
      .addOrderBy('childs._id')
      .getMany();

    const result = plainToInstance(CategoryOutput, category, {
      excludeExtraneousValues: true,
    });
    return {
      error: false,
      data: result,
      message: MESSAGES.GET_SUCCEED,
      code: 200,
    };
  }

  async create(data: CreateCategory): Promise<BaseApiResponse<CategoryOutput>> {
    const createCategory = this.categoryRepository.create(data);

    if (data.categoryId) {
      const parent = await this.categoryRepository.findOne({
        where: { _id: data.categoryId },
      });
      if (parent) {
        createCategory.category = parent;
      }
    }
    await this.categoryRepository.save(createCategory);
    const result = plainToInstance(CategoryOutput, createCategory, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }
}
