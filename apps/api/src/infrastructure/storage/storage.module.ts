import { Module } from '@nestjs/common';

import { STORAGE_SERVICE } from '@/infrastructure/storage/storage.token';
import { CloudinaryModule } from '@/infrastructure/storage/cloudinary/cloudinary.module';
import { CloudinaryStorageService } from '@/infrastructure/storage/cloudinary/cloudinary.service';

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
