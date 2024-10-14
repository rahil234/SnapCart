import multer from 'multer';

const MulterStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  },
});

const upload = multer({ storage: MulterStorage });

export default upload;
