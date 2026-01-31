export interface HTTP_RESPONSE<T = any> {
  message: string;
  success: boolean;
  data?: T;
  accessToken?: string;
}

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
