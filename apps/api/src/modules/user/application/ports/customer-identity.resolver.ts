export const CUSTOMER_IDENTITY_RESOLVER = Symbol('CUSTOMER_IDENTITY_RESOLVER');

export interface CustomerIdentityResolver {
  /**
   * Resolves the active customerId for a given userId.
   * Throws if no customer profile exists.
   */
  resolveCustomerIdByUserId(userId: string): Promise<string>;
}
