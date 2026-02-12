import { AccountStatus, UserRole } from '@/modules/user/domain/enums';

export type GetMeResult = {
  id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;

  customerProfile?: {
    id: string;
    name?: string;
    profilePicture?: string;
    cartId?: string;
  };

  sellerProfile?: {
    id: string;
    storeName: string;
    isVerified: boolean;
  };
};
