import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CloudinaryStorageService } from '@/infrastructure/storage/cloudinary/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
  ],
  providers: [CloudinaryStorageService],
  exports: [CloudinaryStorageService],
})
export class CloudinaryModule {}
