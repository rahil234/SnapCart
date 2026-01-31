import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MediaDomainModule } from '../../domain/media/media.domain.module';
import { MediaController } from '../../infrastructure/media/controllers/media.controller';
import { StorageModule } from '@/common/storage/storage.module';

@Module({
  imports: [CqrsModule, MediaDomainModule, StorageModule],
  controllers: [MediaController],
})
export class MediaApplicationModule {}
