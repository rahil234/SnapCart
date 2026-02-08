import { Query } from '@nestjs/cqrs';

import { CartWithDetailsResponseDto } from '@/modules/cart/interfaces/http/dto/response';

export class GetCartWithDetailsQuery extends Query<CartWithDetailsResponseDto> {
  constructor(public readonly userId: string) {
    super();
  }
}
