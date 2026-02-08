import { CartWithDetailsResponseDto } from '@/modules/cart/interfaces/http/dto/response/cart-with-details-response.dto';

/**
 * Cart Read Repository Interface
 * For read-optimized queries that return DTOs directly (CQRS Read side)
 */
export interface CartItemReadRepository {
  /**
   * Find cart by customer ID with all related data populated
   * Returns DTO directly for optimal read performance
   */
  findByCustomerIdWithDetails(
    customerId: string,
  ): Promise<CartWithDetailsResponseDto | null>;
}
