import { Module } from '@nestjs/common';
import { MediaService } from '@/domain/media/services/media.service';

@Module({
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaDomainModule {}
