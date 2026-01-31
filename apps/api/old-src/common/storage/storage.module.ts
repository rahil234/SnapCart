import { Module } from '@nestjs/common';

import { AzureModule } from '@/common/storage/azure/azure.module';
import { CloudinaryModule } from '@/common/storage/cloudinary/cloudinary.module';
import { STORAGE_SERVICE } from '@/common/storage/storage.token';
import { CloudinaryStorageService } from '@/common/storage/cloudinary/cloudinary.service';

@Module({
  imports: [CloudinaryModule],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: CloudinaryStorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
