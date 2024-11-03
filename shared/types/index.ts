import { Document, Schema } from 'mongoose';

interface Review {
  _id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Product {
  _id: string;
  name: string;
  category: { _id: string; name: string };
  subcategory: { _id: string; name: string };
  price: number;
  quantity: string;
  variantName?: string;
  stock?: number;
  images: string[];
  description?: string;
  tags?: string[];
  discount?: number;
  status: 'Active' | 'Inactive';
  variants?: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  };
  reviews?: Review[];
}

export interface Category {
  _id: string;
  name: string;
  status: string;
  subcategory: Subcategory;
}

export interface Subcategory {
  _id: string;
  name: string;
  status: 'Active' | 'Blocked';
}

export type UserRole = 'admin' | 'customer' | 'seller';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  role: UserRole;
  addresses: [];
  profilePicture: string;
  status: 'Active' | 'Blocked';
}

export interface IUsers extends Document {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  addresses: Array<object>;
  email: string;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
}

export interface Seller extends Document {
  _id: string;
  firstName: string;
  profilePicture: string;
  email: string;
  DOB: string;
  status: 'Active' | 'Blocked';
}

export interface IAdmin extends Document {
  _id: string;
  firstName: string;
  email: string;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
}
export interface Credentials {
  email: string;
  password: string;
}

export type ObjectId = Schema.Types.ObjectId;

export interface ICart extends Document {
  userId: string;
  items: Array<{
    _id: string;
    product: string;
    quantity: number;
  }>;
  totalPrice: number;
}

export interface ICartP extends Omit<ICart, 'items'> {
  items: Array<{
    _id: string;
    product: Product;
    quantity: number;
  }>;
}

export interface Variant {
  id: number;
  name: string;
  price: string;
  stock: string;
  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  file: File;
  preview: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ImportMetaEnv {
  readonly VITE_googleOAuthClientId: string;
  readonly VITE_BUCKET_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_imageUrl: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface catchError {
  code: number;
  name: string;
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

// export interface ICart {
//   _id: string;
//   userId: string;
//   items: Array<{
//     _id: string;
//     productId: Product ;
//     quantity: number;
//   }>;
//   totalPrice: number;
// }

// type Result<T extends string> = T extends 'customer' ? IUsers : Seller | IAdmin;
// export type customer='customer'
// export type admin='admin'
// export type seller='seller'
// export function processInput(
//   role: customer | admin | seller,
//   user: unknown
// ) {
//   if (role === 'customer') {
//     return user as IUsers;
//   }else if(role === 'seller'){
//     return user as Seller
//   }else{
//     return user as IAdmin  }

// }

// export interface Category {
//   name: string;
//   categoryId: string;
//   products: Product[];
//   subcategories: Subcategory[];
// }

// export interface Subcategory {
//   subcategory: string;
//   subcategoryId: string;
//   products: Product[];
// }

// export interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   quantity: string;
//   stock: number;
//   status: 'Active' | 'Inactive';
//   reviews: Array<Review>;
//   images: string[];
//   variants: object[];
//   description: string;
//   category: Category;
//   subcategory: Subcategory;
// }
