/**
 * Get Admin Products Query
 *
 * Retrieves all products with all statuses for admin panel
 */
export class GetAdminProductsQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly search?: string,
    public readonly status?: string,
    public readonly categoryId?: string,
  ) {}
}
