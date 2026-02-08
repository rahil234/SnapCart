export interface SellerIdentityPort {
  getSellerProfileId(userId: string): Promise<string>;
}

export const SELLER_IDENTITY_PORT = Symbol('SELLER_IDENTITY_PORT');
