import { Request, Response } from 'express';
import walletModel from '@models/walletTransactionModel';
import userModel from '@models/userModel';

const getTransaction = async (req: Request, res: Response) => {
  console.log(req?.user?._id);
  try {
    const transactions = await walletModel.find({ userId: req?.user?._id });
    res.status(200).json({ message: 'success', transactions });
  } catch (error) {
    res.status(500).json({ message: 'error', error });
  }
};

const getBalance = async (req: Request, res: Response) => {
  const user = await userModel.findById(req.user?._id);
  if (!user) {
    res.status(200).json({ message: 'user not found' });
  }
  res.status(200).json({ message: 'success', balance: user?.walletBalance });
};

export default { getBalance, getTransaction };
