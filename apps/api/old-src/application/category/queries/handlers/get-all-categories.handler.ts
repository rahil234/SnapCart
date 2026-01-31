import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllCategoriesQuery } from '../get-all-categories.query';
import { Category } from '@/domain/category/entities';

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {
  constructor() {}

  async execute(query: GetAllCategoriesQuery): Promise<Category[]> {
    // TODO: Inject CategoryRepository when implemented
    // For now, returning empty array as placeholder
    return [];
  }
}
