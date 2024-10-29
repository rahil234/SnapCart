import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwtUtils from '@/utils/jwtUtils';
import { setRefreshTokenCookie } from '../utils/cookieUtils';
import userModel from '../models/userModel';
import adminModel from '@models/adminModel';
import sellerModel from '../models/sellerModel';
import bannerModel from '@/models/bannerModel';
import { catchError } from '@shared/types';

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newAdmin = new adminModel({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    const myError = error as catchError;
    res.status(400).json({ message: myError.message });
  }
};

const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email });

  if (!admin) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const validPassword = bcrypt.compareSync(password, admin.password);

  if (validPassword) {
    const user = {
      _id: admin._id,
      firstName: admin.firstName,
      email: admin.email,
      role: 'admin',
    };

    const refreshToken = jwtUtils.signRefreshToken({
      _id: admin._id,
      email: admin.email,
      role: 'admin',
    });
    setRefreshTokenCookie(res, refreshToken);

    const accessToken = jwtUtils.signAccessToken({ email: user.email });

    res.status(200).json({ message: 'success', accessToken, user });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
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

const getSellers = async (req: Request, res: Response) => {
  try {
    const sellers = await sellerModel.find();
    res.status(200).json(sellers);
  } catch (error) {
    console.log(error);
  }
};

const addSeller = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if the seller already exists
    const existingSeller = await sellerModel.findOne({ email });
    if (existingSeller) {
      res.status(400).json({ message: 'Seller already exists' });
      return;
    }

    // Create a new seller
    const newSeller = new sellerModel({
      name,
      email,
      password,
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

const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await bannerModel.find().sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Failed to fetch banners' });
  }
};

const uploadBannerImage = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    if (!req.file) {
      res.status(400).json({ message: 'No image uploaded' });
      return;
    }
    const imageUrl = req.file.filename;

    // const banner = await bannerModel.findById(bannerId);
    // if (banner) {
    //   await bannerModel.findByIdAndUpdate(
    //     bannerId,
    //     { image: imageUrl },
    //     { new: true }
    //   );
    // } else {
    const newBanner = new bannerModel({
      image: imageUrl,
      order: 1,
    });
    await newBanner.save();

    const banner = await bannerModel.findOne({ image: imageUrl });

    if (!banner) {
      res.status(404).json({ message: 'Banner not found' });
      return;
    }

    res.status(200).json({ imageUrl: banner.image });
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({ message: 'Failed to upload banner image' });
  }
};

const updateBannerOrder = async (req: Request, res: Response) => {
  try {
    const { banners } = req.body;

    const updatePromises = banners.map(
      (banner: { _id: string; order: number }) =>
        bannerModel.findByIdAndUpdate(banner._id, { order: banner.order })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Banner order updated successfully' });
  } catch (error) {
    console.error('Error updating banner order:', error);
    res.status(500).json({ message: 'Failed to update banner order' });
  }
};

const saveBanners = async (req: Request, res: Response) => {
  try {
    const { banners } = req.body;

    const savePromises = banners.map(
      (banner: { id: string; image: string; order: number }) => {
        if (banner.id === '-1') {
          // Create a new banner with a new ObjectId
          const newBanner = new bannerModel({
            _id: new mongoose.Types.ObjectId(),
            image: banner.image,
            order: banner.order,
          });
          return newBanner.save();
        } else {
          // Update existing banner
          return bannerModel.findByIdAndUpdate(banner.id, {
            image: banner.image,
            order: banner.order,
          });
        }
      }
    );

    await Promise.all(savePromises);

    res.status(200).json({ message: 'Banners saved successfully' });
  } catch (error) {
    console.error('Error saving banners:', error);
    res.status(500).json({ message: 'Failed to save banners' });
  }
};

const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { bannerId } = req.params;
    await bannerModel.findByIdAndDelete(bannerId);
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner' });
  }
};

export default {
  createAdmin,
  adminLogin,
  getUsers,
  getSellers,
  addSeller,
  getBanners,
  uploadBannerImage,
  updateBannerOrder,
  saveBanners,
  deleteBanner,
};
