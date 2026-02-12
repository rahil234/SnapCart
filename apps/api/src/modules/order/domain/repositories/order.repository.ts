import { Order } from '../entities';
import { OrderStatus } from '../enums';

export interface OrderFilters {
  customerId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
  sellerId?: string; // For filtering by seller's products
}

/**
 * Order Repository Interface
 * Defines the contract for order data access
 */
export interface OrderRepository {
  /**
   * Find order by ID
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Find order by order number
   */
  findByOrderNumber(orderNumber: string): Promise<Order | null>;

  /**
   * Find all orders by customer ID with pagination
   */
  findByCustomerId(
    customerId: string,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }>;

  /**
   * Find all orders with filters and pagination
   */
  findAll(
    filters: OrderFilters,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }>;

  /**
   * Find orders containing products from a specific seller
   */
  findBySellerProducts(
    sellerId: string,
    skip: number,
    take: number,
  ): Promise<{ orders: Order[]; total: number }>;

  /**
   * Save (create or update) an order
   */
  save(order: Order): Promise<Order>;

  /**
   * Get order statistics for a customer
   */
  getCustomerOrderStats(customerId: string): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }>;
}
