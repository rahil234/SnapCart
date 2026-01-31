export interface IOffer {
  _id: string;
  name: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: Date;
  endDate: Date;
  products: any[]; // Replace 'any' with a more specific type if you have one for Product
  categories: any[]; // Replace 'any' with a more specific type if you have one for Category
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
