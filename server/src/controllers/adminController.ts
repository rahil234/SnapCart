import { Request, Response } from 'express';
import categoryModel from '../models/categoryModel';

const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (email === 'admin@gmail.com' && password === '12345678') {
    res.status(200).json({ message: 'success', token: '1234567890' });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.find();
    console.log(category);
    res.status(200).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const editCategories = (req: Request, res: Response) => {
  try {
    console.log(req.body);

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
  }
};

const addProduct = (req: Request, res: Response) => {
  console.log(req.body);
};

export { adminLogin, getCategories, editCategories, addProduct };
