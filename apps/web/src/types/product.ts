export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: any; // Replace 'any' with a more specific type if you have one for Category
  seller: any; // Replace 'any' with a more specific type if you have one for Seller
  stock: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
