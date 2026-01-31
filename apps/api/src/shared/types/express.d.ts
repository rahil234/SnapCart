import { JWTPayload } from '@/common/types/index';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: JWTPayload['role'];
      };
    }
  }
}

export {};
