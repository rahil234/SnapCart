export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'Percentage' | 'Flat';
  maxDiscount?: number;
  minAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  usageLimit?: number;
  usedCount: number;
  maxUsagePerUser: number;
  applicableTo: 'all' | 'specific_products' | 'specific_categories';
  isStackable: boolean;
  description?: string;
  isActive: boolean;
  isLimitReached: boolean;
  createdAt: string;
  updatedAt: string;
}
