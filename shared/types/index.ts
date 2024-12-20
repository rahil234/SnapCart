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
  variantId: string;
  variantName: string;
  stock: number;
  images: string[];
  description?: string;
  tags?: string[];
  discount?: number;
  seller: string;
  status: 'Active' | 'Inactive';
  variants?: Variant[];
  reviews?: Review[];
  offer?: IOffer;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  status: string;
  soldCount: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  status: 'Active' | 'Blocked';
  category: string;
  soldCount: number;
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

export interface IReferal {
  code: string;
  referredBy?: string;
  referredUsers?: string[];
  referLimit: number;
}

export interface IUsers extends Document {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  addresses: Array<object>;
  email: string;
  walletBalance: number;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
  referral: IReferal;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeller extends Document {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  profilePicture: string | null;
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

//
// export interface Credentials {
//   email: string;
//   password: string;
// }

export type ObjectId = Schema.Types.ObjectId;

export interface ICart extends Document {
  userId?: string;
  items: Array<{
    _id: string;
    product: string;
    quantity: number;
  }>;
  totalAmount: number;
  totalItems: number;
}

export interface ICartP {
  userId?: string;
  items: Array<CartItem>;
  totalAmount: number;
  totalItems: number;
}

export interface CartItem {
  _id: string;
  quantity: number;
  product: Product;
  offerPrice?: number;
}

export interface Variant {
  id: string;
  // productId: string;
  variantName: string;
  price: string;
  stock: string;
  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  file: File;
  preview: string;
}

//
// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

interface ImportMetaEnv {
  readonly VITE_googleOAuthClientId: string;
  readonly VITE_BUCKET_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_imageUrl: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
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

export interface IOrderItem {
  _id: string;
  name: string;
  quantity: number;
  seller: string;
  price: number;
  offerPrice: number;
  image: string;
  status?: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Approved' | 'Returned';
}

export interface IOrder extends Document {
  items: IOrderItem[];
  userId: string;
  customerName: string;
  orderId: string;
  address: [];
  paymentMethod: string;
  price: number;
  status:
    | 'Payment Pending'
    | 'Processing'
    | 'Pending'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Return Pending'
    | 'Return Requested'
    | 'Return Approved'
    | 'Return Cancelled'
    | 'Returned';
  orderDate: Date;
  discount: number;
  deliveryCharge: number;
  orderedBy: IUsers;
  createdAt: Date;
  updatedAt: Date;
}

// interface Offer {
//   _id: string;
//   title: string;
//   discount: number;
//   startDate: string;
//   type: 'percentage' | 'fixed';
//   products: string[];
//   categories: string[];
//   maxDiscount: number;
//   status: 'Active' | 'Inactive';
//   expiryDate: string;
// }

export interface IOffer {
  _id: string;
  title: string;
  type: 'Percentage' | 'Fixed';
  discount: number;
  startDate: Date;
  expiryDate: Date;
  applicableTo?: 'All' | 'Products' | 'Categories';
  products: string[];
  categories: string[];
  status: 'Active' | 'Inactive';
  limit: number;
  maxDiscount: number;
}

// export interface ICoupon {
//   _id: string;
//   code: string;
//   discount: number;
//   type: "percentage" | "fixed";
//   minAmount: number;
//   maxDiscount: number;
//   startDate: string;
//   endDate: string;
//   status: "Active" | "Inactive";
//   applicableTo: "All" | "Products" | "Categories";
//   products: string[];
//   categories: string[];
// }

export interface ICoupon {
  _id: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed';
  status: 'Active' | 'Inactive';
  minAmount: number;
  maxDiscount: number;
  limit: number;
  applicableTo: 'All' | 'New' | 'Existing' | 'Exclusive';
}

export interface Address {
  id?: string;
  _id: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
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

// export interface ISeller extends Document {
//   _id: string;
//   firstName: string;
//   profilePicture: string;
//   email: string;
//   DOB: string;
//   status: 'Active' | 'Blocked';
// }
