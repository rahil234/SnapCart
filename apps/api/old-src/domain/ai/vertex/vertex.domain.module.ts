import { Module } from '@nestjs/common';
import { VertexService } from '@/domain/ai/vertex/vertex.service';

@Module({
  providers: [VertexService],
  exports: [VertexService],
})
export class VertexDomainModule {}
