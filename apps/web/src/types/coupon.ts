export interface ICoupon {
  _id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expiry: Date;
  minCartValue: number;
  maxDiscount: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
