import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sellerModel from '@models/sellerModel';

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  if (!REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_SECRET) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: 'Invalid token' });
        return;
      }

      try {
        const seller = await sellerModel.findById(decoded._id);
        if (!seller) {
          res.status(404).json({ message: 'Seller not found' });
          return;
        }

        const accessToken = jwt.sign(
          { id: seller._id, role: 'seller' },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: '15m',
          }
        );

        const newUser = {
          _id: seller._id,
          name: seller.firstName,
          email: seller.email,
          role: 'seller',
        };

        console.log('NewUser', newUser);

        res.status(200).json({ accessToken, user: newUser });
      } catch {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  );
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(200).json({ message: 'Logout successful' });
};

export default { refreshToken, logout };
