import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryByIdQuery } from '../get-category-by-id.query';
import { Category } from '@/modules/category/domain/entities';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(query: GetCategoryByIdQuery): Promise<Category> {
    const { categoryId } = query;

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }
}
