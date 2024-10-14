import { Request, Response } from 'express';
import categoryModel from '../models/categoryModel';
import subcategoryModel from '../models/subcategoryModel';
import productModel from '../models/productModel';
import userModel from '../models/userModel';

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
    const categories = await categoryModel.find();
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await subcategoryModel.find({
          categoryId: category._id,
        });
        return { ...category.toObject(), subcategories };
      })
    );
    res.status(200).json(categoriesWithSubcategories);
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

const getProducts = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: (error as any).message as string });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.files, req.body);
    const { productName, category, price, piece } = req.body;
    const images = req.files as Express.Multer.File[];

    // Save images to the uploads folder
    const imagePaths = images.map((image) => image.filename);

    // Save product details to the database
    const newProduct = new productModel({
      name: productName,
      category,
      price,
      quantity: piece,
      images: imagePaths,
    });
    newProduct.save();

    res
      .status(200)
      .json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error adding product' });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export {
  adminLogin,
  getCategories,
  editCategories,
  addProduct,
  getProducts,
  getUsers,
};
