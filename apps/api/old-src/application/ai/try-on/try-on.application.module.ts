import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TryOnDomainModule } from '../../../domain/ai/try-on/try-on.domain.module';
import { TryOnController } from '../../../infrastructure/ai/try-on/controllers/try-on.controller';
import { VertexApplicationModule } from '../vertex/vertex.application.module';
import { UserApplicationModule } from '../../user/user.application.module';
import { ProductApplicationModule } from '../../product/product.application.module';
import { MediaApplicationModule } from '../../media/media.application.module';

@Module({
  imports: [
    CqrsModule,
    TryOnDomainModule,
    VertexApplicationModule,
    UserApplicationModule,
    ProductApplicationModule,
    MediaApplicationModule,
  ],
  controllers: [TryOnController],
})
export class TryOnApplicationModule {}
