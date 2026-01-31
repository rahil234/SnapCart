export * from '@/shared/types/http-response';
export * from '@/shared/types/razorpay';
export * from '@/shared/types/paginated-result';
export * from '@/shared/types/pagination-meta';

export interface HTTP_PAGINATED_RESPONSE {
  total?: number;
  limit?: number;
  page?: number;
}

export interface User {
  id: string;
  email?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  sub: string;
  role: 'user' | 'admin';
}

export interface RequestUser {
  id: string;
  role: 'user' | 'admin';
}
