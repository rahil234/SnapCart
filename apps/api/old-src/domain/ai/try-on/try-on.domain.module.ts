import { Module } from '@nestjs/common';
import { TryOnService } from '@/domain/ai/try-on/services/try-on.service';

@Module({
  providers: [TryOnService],
  exports: [TryOnService],
})
export class TryOnDomainModule {}
