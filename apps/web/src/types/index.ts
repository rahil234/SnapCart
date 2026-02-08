export * from './user';
export * from './product';
export * from './cart';
export * from './address';

export interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
