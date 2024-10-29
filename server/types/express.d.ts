/**
 * This file is used to extend the Request interface of Express.
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        role: 'admin' | 'user' | 'seller';
      };
    }
  }
}

export {};
