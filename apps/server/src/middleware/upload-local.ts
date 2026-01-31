import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const uploadDir = path.join(__dirname, '../images');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const MulterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const uniqueName = `${uuidv4()}.${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: MulterStorage });

export default upload;
