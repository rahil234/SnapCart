import { AccountStatus, UserRole } from '@/modules/user/domain/enums';

export type GetMeResult = {
  userId: string;
  email?: string;
  role: UserRole;
  status: AccountStatus;

  customerProfile?: {
    id: string;
    name?: string;
    cartId?: string;
  };

  sellerProfile?: {
    id: string;
    storeName: string;
    isVerified: boolean;
  };
};
