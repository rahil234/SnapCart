/**
 * Product Update Intent
 *
 * Explicit intent for product updates to enforce authorization rules.
 * This prevents ambiguous updates where we have to "guess" what the user wants to do.
 */
export enum ProductUpdateIntent {
  /**
   * Seller updating their own product details (name, description, brand, category)
   */
  SELLER_UPDATE = 'SELLER_UPDATE',

  /**
   * Admin changing product status for governance (active, inactive, discontinued)
   */
  ADMIN_STATUS_UPDATE = 'ADMIN_STATUS_UPDATE',
}
