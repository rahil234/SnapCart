import { Request, Response } from 'express';
import { signAccessToken, verifyRefreshToken } from '@/utils/jwtUtils';
import userModel from '@models/userModel';
import sellerModel from '@models/sellerModel';
import adminModel from '@models/adminModel';
import { clearRefreshTokenCookie } from '@/utils/cookieUtils';
import { IUsers, ISeller, IAdmin } from 'shared/types';

function TypeGuard(
  role: string,
  user: IUsers | ISeller | IAdmin | null
): user is IUsers {
  if (role === 'customer') {
    return true;
  } else {
    return false;
  }
}

const getUserByRoleAndId = async (role: string, id: string) => {
  switch (role) {
    case 'customer':
      return (await userModel.findById(id)) as IUsers;
    case 'seller':
      return (await sellerModel.findById(id)) as ISeller;
    case 'admin':
      return (await adminModel.findById(id)) as IAdmin;
    default:
      return null;
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refreshToken'];

  if (!refreshToken) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const decodedToken = verifyRefreshToken(refreshToken);
  if (!decodedToken) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
  try {
    const user = await getUserByRoleAndId(decodedToken.role, decodedToken._id);

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

    const accessToken = signAccessToken({
      _id: user._id,
      email: user.email,
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
