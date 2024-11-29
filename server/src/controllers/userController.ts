import { Request, Response } from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { signAccessToken } from '@/utils/jwtUtils';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '@/utils/cookieUtils';
import otpModel from '@models/otpModel';
import userModel from '@models/userModel';
import { catchError } from 'shared/types';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'snapcart.website@gmail.com',
    pass: 'blik rpge njhj aose',
  },
});

const sendOtp = async (email: string) => {
  try {
    const otp: number = Math.floor(1000 + Math.random() * 9000);

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

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        throw new Error('Failed to send OTP: ' + error);
      } else {
        // Update or create the OTP document using upsert
        const result = await otpModel.updateOne(
          { email },
          { $set: { otp } },
          { upsert: true }
        );
        console.log(result);
      }
      console.log('Email sent: ' + info.response);
    });
  } catch (err) {
    throw new Error('Failed to send OTP: ' + err);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(401).json({ message: 'Email and password required' });
    }

    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(req.body.password, user?.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    setRefreshTokenCookie(res, { _id: user._id, role: 'customer' });

    const accessToken = signAccessToken({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      profilePicture: user.profilePicture,
      addresses: user.addresses,
      role: 'customer',
    });

    res.status(200).json({ message: 'success', accessToken, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { googleAccessToken } = req.body;
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleAccessToken}`,
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          Accept: 'application/json',
        },
      }
    );
    const { email, given_name } = response.data;

    let userData = await userModel.findOne({ email });

    if (!userData) {
      // User does not exist, create a new user with a random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const newUser = new userModel({
        email,
        firstName: given_name,
        password: hashedPassword,
      });
      await newUser.save();
      userData = newUser;
    } else if (userData.status === 'Blocked') {
      clearRefreshTokenCookie(res);
      res.status(403).json({ message: 'User is blocked' });
      return;
    }

    const user = {
      _id: userData._id,
      firstName: userData.firstName,
      email: userData.email,
      profilePicture: userData.profilePicture,
      addresses: userData.addresses,
      role: 'customer',
    };

    setRefreshTokenCookie(res, { _id: user._id, role: 'customer' });

    const accessToken = signAccessToken({
      _id: userData._id,
      role: 'customer',
    });

    res.status(201).json({ accessToken, user });
  } catch (error) {
    const newError = error as catchError;
    res
      .status(500)
      .json({ message: 'Internal server error', error: newError.message });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const [firstName, lastName] = name.split(' ');

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = await userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    userData.save();

    const user = {
      _id: userData._id,
      firstName: userData.firstName,
      email: userData.email,
      role: 'customer',
    };

    setRefreshTokenCookie(res, { _id: user._id, role: 'customer' });

    const accessToken = signAccessToken({ ...user });
    res
      .status(201)
      .json({ accessToken, message: 'User created successfully', user });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'user signup failed' });
  }
};

const verifySignUp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already registered' });
      return;
    }

    sendOtp(email);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    await sendOtp(email);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' + err });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (!existingUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    existingUser.password = hashedPassword;

    await existingUser.save();

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' + err });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    await sendOtp(email);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' + err });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const otpUser = await otpModel.findOne({ email });
    if (otp === otpUser?.otp) {
      console.log('OTP verified', otp, ':', otpUser?.otp);
      res.json({ message: 'OTP verified', success: true });
    } else {
      console.log('Wrong Otp', otp, ':', otpUser?.otp);
      throw 'Invalid OTP';
    }
  } catch (err) {
    res.status(404).json({ message: err });
    console.log(err);
  }
};

const uploadProfilePicture = async (req: Request, res: Response) => {
  console.log(req.file);

  try {
    if (!req.file) {
      res.status(400).json({ message: 'Profile picture is required' });
      return;
    }

    const user = await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { profilePicture: req.file.filename.split('/').pop() },
      },
      { new: true }
    );

    const profilePicture = user?.profilePicture;
    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const user = await userModel.findByIdAndUpdate(req.user?._id, {
      firstName: name,
      addresses: req.body.addresses,
    });

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const blockUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);
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

const allowUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId);
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

const addAddress = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user?._id, {
      $push: { addresses: req.body },
    });

    res.status(200).json({ message: 'Address added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export default {
  login,
  googleLogin,
  signup,
  verifySignUp,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtp,
  uploadProfilePicture,
  updateProfile,
  blockUser,
  allowUser,
  addAddress,
};
