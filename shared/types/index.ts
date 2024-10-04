// shared/types/index.ts

// Define the structure of a Product
export interface Product {
    id: string; // Unique identifier
    name: string;
    price: number;
    quantity: string;
    image: string;
  }
  
  // Define the structure of a Category
  export interface Category {
    categoryName: string;
    categoryId: string;
    products: Product[];
  }
  
  // Define User Roles
  export type UserRole = 'admin' | 'user' | 'seller';
  
  // Define the structure of a User
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
  
  // Define Credentials for Authentication
  export interface Credentials {
    email: string;
    password: string;
  }
  
  // Define API Response Structures
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }