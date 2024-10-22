import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sellerModel from '@/models/sellerModel';

const sellerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the seller by email
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
    // Check if the password is correct

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = {
      _id: seller._id,
      name: seller.firstName,
      email: seller.email,
      roles: ['seller'],
    };

    // Generate a token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'success', token, user });
  } catch (error) {
    console.error('Error logging in seller:', error);
    res.status(500).json({ message: 'Failed to login seller' });
  }
};

const addSeller = async (req: Request, res: Response) => {
  try {
    const { firstName, email, password } = req.body;

    // Check if the seller already exists
    const existingSeller = await sellerModel.findOne({ email });

    if (existingSeller) {
      res.status(400).json({ message: 'Seller already exists' });
      return;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new seller
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
