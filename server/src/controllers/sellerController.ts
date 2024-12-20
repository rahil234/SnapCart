import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signAccessToken } from '@/utils/jwtUtils';
import sellerModel from '@/models/sellerModel';
import { setRefreshTokenCookie } from '@/utils/cookieUtils';

const sellerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const seller = await sellerModel.findOne({ email });

    if (!seller) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    if (seller.status === 'Blocked') {
      res.status(401).json({ message: 'Seller is blocked' });
      return;
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = {
      _id: seller._id,
      name: seller.firstName,
      email: seller.email,
      role: 'seller',
    };

    setRefreshTokenCookie(res, { _id: seller._id, role: 'seller' });

    const accessToken = signAccessToken({ _id: seller._id, role: 'seller' });

    res.status(200).json({ message: 'success', accessToken, user });
  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ message: 'Failed to login seller' });
  }
};

const addSeller = async (req: Request, res: Response) => {
  try {
    const { firstName, email, password } = req.body;

    const existingSeller = await sellerModel.findOne({ email });

    if (existingSeller) {
      res.status(400).json({ message: 'Seller already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new sellerModel({
      firstName,
      email,
      password: hashedPassword,
    });
    await newSeller.save();

    res
      .status(201)
      .json({ message: 'Seller added successfully', seller: newSeller });
  } catch (error) {
    console.error('Error adding seller:', error);
    res.status(500).json({ message: 'Failed to add seller' });
  }
};

const blockSeller = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await sellerModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.status = 'Blocked';
    await user.save();

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block user', error });
  }
};

const allowSeller = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await sellerModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.status = 'Active';
    await user.save();

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block user', error });
  }
};

export default { sellerLogin, addSeller, blockSeller, allowSeller };
