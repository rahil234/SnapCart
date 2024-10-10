import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import otpModel from '../models/otpModel';
import userModel from '../models/userModel';
import productModel from '../models/productModel';
import categoryModel from '../models/categoryModel'; // Import the category model

const createJWT = (data: object) => jwt.sign(data, 'sdfthsgffgh');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'snapcart.website@gmail.com',
    pass: 'blik rpge njhj aose',
  },
});

const login = async (req: Request, res: Response) => {
  try {
    const hashedPasword = await bcrypt.hash(req.body.password, 10);

    if (!req.body.email || !req.body.password) {
      res.status(401).json({ message: 'Email and password required' });
    } else {
      const user = await userModel.findOne({
        email: req.body.email,
        password: hashedPasword,
      });

      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
      } else {
        const token = createJWT({ email: user.email });
        res.status(200).json({ token, message: 'success', user });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const user = await userModel.create(req.body);
    user.save();

    const token = createJWT({ email: user.email });
    res.status(201).json({ token, message: 'User created successfully' });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    // Step 1: Find the first three categories
    const categories = await categoryModel.find().limit(3);

    // Log the categories to verify
    console.log('Categories:', categories);

    // Step 2: For each category, find up to 10 products
    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        // Log the category ID to verify
        console.log('Category ID:', category._id);

        const products = await productModel
          .find({ categoryId: category._id })
          .limit(10);

        // Log the products to verify
        console.log('Products for category:', category.name, products);

        return {
          categoryId: category._id,
          category: category.name,
          products,
        };
      })
    );

    // Step 3: Send the combined results in the response
    res.json(categoryProducts);
  } catch (err) {
    console.error('Error:', err);
    res.status(404).json({ message: err });
  }
};

const getProduct = (req: Request, res: Response) => {
  // const productId = req.params.productId;
  // let foundProduct = null;

  // products.forEach((category) =>
  //   category.products.forEach((product) => {
  //     if (product.id === productId) {
  //       foundProduct = product;
  //     }
  //   })
  // );

  // if (foundProduct) {
  //   res.json('foundProduct');
  // } else {
  res.status(404).json({ message: 'Product not found' });
  // }
};

const sendOtp = async (req: Request, res: Response) => {
  try {
    const otp: string = Math.floor(100000 + Math.random() * 900000).toString();
    const email = 'rahil234@gmail.com';
    const newOtp = await otpModel.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    newOtp.updateOne();

    const mailOptions = {
      to: 'rahilsardar234@gmail.com',
      subject: 'OTP for Snapcart Login',
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #FFDC02; color:#000000; padding: 20px; border-radius: 10px;">
      <h1 style="color: #000000; font-size:35px;">Welcome to SnapCart</h1>
      <p>Use the following OTP to verify your email:</p>
      <h2 style="color: #198C05; line-width: 1.5; font-size:35px">${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Thank you,</p>
      <p>The Snapcart Team</p>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: `OTP ${otp}` });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const otpUser = await otpModel.findOne({
      email: req.body.email,
    });
    const otp: string | null = otpUser ? otpUser.otp : null;
    console.log(otp);
    if (otp === req.body.otp) {
      res.json({ message: 'OTP verified' });
      console.log('OTP verified', otp, ':', req.body.otp);
    } else {
      console.log('Wrong Otp', otp, ':', req.body.otp);
      throw 'Invalid OTP';
    }
  } catch (err) {
    res.status(404).json({ message: err });
    console.log(err);
  }
};

export default { login, signup, getProducts, getProduct, sendOtp, verifyOtp };
