import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCategoriesQuery } from '../get-all-categories.query';
import { Category } from '@/domain/category/entities';
import { CategoryRepository } from '@/domain/category/repositories/category.repository';

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(query: GetAllCategoriesQuery): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}
