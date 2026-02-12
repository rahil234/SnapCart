export const PRODUCT_IDENTITY_RESOLVER = Symbol('CUSTOMER_IDENTITY_RESOLVER');

export interface ProductIdentityResolver {
  /**
   * Resolves the active customerId for a given userId.
   * Throws if no customer profile exists.
   */
  resolveProductIdByVariantId(variantId: string): Promise<string>;
}
