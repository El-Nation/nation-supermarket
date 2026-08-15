import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'nation_supermarket/products',
      format: 'jpeg', // supports promises as well
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
    };
  },
});

export const uploadMedia = multer({ storage: storage });
