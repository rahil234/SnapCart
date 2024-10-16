import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import otpModel from '../models/otpModel';
import userModel from '../models/userModel';
import productModel from '../models/productModel';
import categoryModel from '../models/categoryModel';

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
    if (!req.body.email || !req.body.password) {
      res.status(401).json({ message: 'Email and password required' });
    } else {
      const user = await userModel.findOne({ email: req.body.email });

      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
      } else {
        const isMatch = await bcrypt.compare(req.body.password, user?.password);
        if (!isMatch) {
          res.status(401).json({ message: 'Invalid email or password' });
          return;
        }
        const token = createJWT({ email: user.email });
        res.status(200).json({ token, message: 'success', user });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    console.log(accessToken);
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );
    const { email, name } = response.data;
    let user = await userModel.findOne({ email });
    if (user) {
      // User exists, generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'default_secret',
        {
          expiresIn: '1h',
        }
      );
      res.status(200).json({ token, user });
      return;
    } else {
      // User does not exist, create a new user with a random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new userModel({
        email,
        name,
        password: hashedPassword,
      });
      await user.save();
      // Generate JWT token for the new user
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'default_secret',
        {
          expiresIn: '1h',
        }
      );

      res.status(201).json({ token, user });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    // Hash the password before creating the user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    user.save();

    const token = createJWT({ email: user.email });
    res.status(201).json({ token, message: 'User created successfully', user });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.find().limit(5);

    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        console.log('Category ID:', category._id);

        const products = await productModel
          .find({ category: category._id })
          .limit(10);

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

const getProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;

  const product = await productModel
    .findById(productId)
    .populate('category')
    .populate('subcategory');

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const sendOtp = async (req: Request, res: Response) => {
  console.log('sendOtp');
  try {
    const { email } = req.body;
    console.log(email);

    // Check if the email is provided
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    // Check if the user with the given email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already registered' });
      return;
    }

    const otp: string = Math.floor(1000 + Math.random() * 9000).toString();

    // Find the OTP document by email
    let otpDocument = await otpModel.findOne({ email });

    if (otpDocument) {
      // Update the existing OTP document
      otpDocument.otp = otp;
      await otpDocument.save();
    } else {
      // Create a new OTP document
      otpDocument = new otpModel({ email, otp });
      await otpDocument.save();
    }

    const mailOptions = {
      to: email,
      subject: 'OTP for Snapcart Signup',
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
        res.status(500).json({ message: 'Failed to send OTP' });
        return;
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'OTP sent successfully' });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);
    const otpUser = await otpModel.findOne({ email });
    if (otp === otpUser?.otp) {
      console.log('OTP verified', otp, ':', otpUser?.otp);
      res.json({ message: 'OTP verified' });
    } else {
      console.log('Wrong Otp', otp, ':', otpUser?.otp);
      throw 'Invalid OTP';
    }
  } catch (err) {
    res.status(404).json({ message: err });
    console.log(err);
  }
};

export default {
  login,
  googleLogin,
  signup,
  getProducts,
  getProduct,
  sendOtp,
  verifyOtp,
};
