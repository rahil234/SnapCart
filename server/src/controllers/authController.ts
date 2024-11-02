import { Request, Response } from 'express';
import jwtUtils from '@/utils/jwtUtils';
import userModel from '@models/userModel';
import sellerModel from '@models/sellerModel';
import adminModel from '@models/adminModel';
import { clearRefreshTokenCookie } from '@/utils/cookieUtils';
import { IUsers, Seller, IAdmin } from 'shared/types';

const getUserByRoleAndId = async (role: string, id: string) => {
  switch (role) {
    case 'customer':
      return (await userModel.findById(id)) as IUsers;
    case 'seller':
      return (await sellerModel.findById(id)) as Seller;
    case 'admin':
      return (await adminModel.findById(id)) as IAdmin;
    default:
      return null;
  }
};

function TypeGuard(
  role: string,
  user: IUsers | Seller | IAdmin | null
): user is IUsers {
  if (role === 'customer') {
    return true;
  } else {
    return false;
  }
}

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const decodedToken = jwtUtils.verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
  try {
    let user = await getUserByRoleAndId(decodedToken.role, decodedToken._id);
    if (TypeGuard(decodedToken.role, user)) {
      // user = user as IUsers;
      console.log(user);
    } else {
      user = user as Seller | IAdmin;
    }

    if (!user) {
      clearRefreshTokenCookie(res);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.status === 'Blocked') {
      clearRefreshTokenCookie(res);
      res.status(403).json({ message: 'User is blocked' });
      return;
    }

    const accessToken = jwtUtils.signAccessToken({
      _id: user._id,
      role: decodedToken.role,
    });

    const newUser = {
      _id: user._id,
      firstName: user.firstName,
      profilePicture: user.profilePicture,
      addresses: TypeGuard(decodedToken.role, user) ? user.addresses : [],
      email: user.email,
      role: decodedToken.role,
    };

    res.status(200).json({ accessToken, user: newUser });
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearRefreshTokenCookie(res);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.status(200).json({ message: 'Logout successful' });
};

export default { refreshToken, logout };
