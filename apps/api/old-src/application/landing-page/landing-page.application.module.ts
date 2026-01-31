import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LandingPageDomainModule } from '../../domain/landing-page/landing-page.domain.module';
import { LandingPageController } from '../../infrastructure/landing-page/controllers/landing-page.controller';
import { PrismaLandingPageRepository } from '../../infrastructure/landing-page/repositories/prisma-landing-page.repository';
import { ProductApplicationModule } from '../product/product.application.module';
import { MediaApplicationModule } from '../media/media.application.module';

@Module({
  imports: [
    CqrsModule,
    LandingPageDomainModule,
    ProductApplicationModule,
    MediaApplicationModule,
  ],
  controllers: [LandingPageController],
  providers: [
    {
      provide: 'LandingPageRepository',
      useClass: PrismaLandingPageRepository,
    },
  ],
})
export class LandingPageApplicationModule {}
