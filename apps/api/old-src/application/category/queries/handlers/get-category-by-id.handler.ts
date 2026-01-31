import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetCategoryByIdQuery } from '../get-category-by-id.query';
import { Category } from '@/domain/category/entities';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  constructor() {}

  async execute(query: GetCategoryByIdQuery): Promise<Category | null> {
    // TODO: Inject CategoryRepository when implemented
    // For now, returning null as placeholder
    return null;
  }
}
