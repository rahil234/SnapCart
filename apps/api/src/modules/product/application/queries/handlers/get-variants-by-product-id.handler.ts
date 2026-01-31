import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetVariantsByProductIdQuery } from '../get-variants-by-product-id.query';

@QueryHandler(GetVariantsByProductIdQuery)
export class GetVariantsByProductIdHandler implements IQueryHandler<GetVariantsByProductIdQuery> {
  constructor() {}

  async execute(query: GetVariantsByProductIdQuery): Promise<any[]> {
    // TODO: Implement variant repository
    // Placeholder implementation
    return [];
  }
}
