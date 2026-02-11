export interface Offer {
  id: string;
  name: string;
  type: 'Percentage' | 'Flat';
  discount: number;
  minPurchaseAmount: number;
  maxDiscount?: number;
  priority: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  isStackable: boolean;
  categories: Array<string>;
  products: Array<string>;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
