import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Banner from '@/models/bannerModel';
import { catchError } from '@snapcart/shared/types';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'images', 'banner');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: async (req, file, cb) => {
    try {
      // Query the database for the highest banner image number
      const banners = await Banner.find().sort({ order: -1 }).limit(1);
      const highestNumber =
        banners.length > 0
          ? parseInt(banners[0].image.split('-').pop() || '0', 10)
          : 0;
      const newImageNumber = highestNumber + 1;

      // Generate the new image name
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `banner-image-${newImageNumber}.${fileExtension}`;

      cb(null, fileName);
    } catch (error) {
      const myError = error as catchError;
      console.error('Error generating file name:', myError);
      cb(myError, '');
    }
  },
});

const upload = multer({ storage });

export default upload;
