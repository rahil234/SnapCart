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
  stock?: number;
  images: string[];
  description?: string;
  tags?: string[];
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

export type UserRole = 'admin' | 'user' | 'seller';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  role: UserRole;
}

export interface Seller {
  _id: string;
  name: string;
  email: string;
  DOB: string;
}

export interface Credentials {
  email: string;
  password: string;
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