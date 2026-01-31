import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AzureBlobService } from '@/common/storage/azure/azure-blob.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AZURE_STORAGE_ACCOUNT: Joi.string().required(),
        AZURE_STORAGE_KEY: Joi.string().required(),
        AZURE_STORAGE_CONTAINER: Joi.string().required(),
      }),
    }),
  ],
  providers: [AzureBlobService],
  exports: [AzureBlobService],
})
export class AzureModule {}
