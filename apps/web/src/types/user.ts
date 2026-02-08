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
  id: string;
  email?: string;
  phone?: string;
  sellerProfile?: SellerProfile;
  customerProfile?: CustomerProfile;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'active' | 'suspended' | 'disabled';
}
