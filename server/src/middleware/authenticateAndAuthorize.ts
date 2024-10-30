import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateAndAuthorize = (
  roles: Array<'admin' | 'user' | 'seller'> = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
      if (err) {
        console.error(err);
        res.status(403).json({ message: 'Invalid token' });
        return;
      }

      // Attach the user to the request
      req.user = user as Request['user'];

      // Check if roles are specified and if the user's role is allowed
      if (roles.length && (!req.user || !roles.includes(req.user.role))) {
        res.status(403).json({ message: 'Permission denied' });
        return;
      }

      next();
    });
  };
};

export default authenticateAndAuthorize;
