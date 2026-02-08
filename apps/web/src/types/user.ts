import { Address } from '@/types';

export interface SellerProfile {
  id: string;
  storeName: string;
  isVerified: boolean;
}

export interface CustomerProfile {
  id: string;
  name?: string;
  cartId?: string;
  profilePicture?: string;
  addresses?: Address[];
}

export interface User {
  userId: string;
  email?: string;
  phone?: string;
  sellerProfile?: SellerProfile;
  customerProfile?: CustomerProfile;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'active' | 'inactive' | 'blocked' | 'suspended' | 'disabled';
}
