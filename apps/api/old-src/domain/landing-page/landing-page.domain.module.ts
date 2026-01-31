import { Module } from '@nestjs/common';
import { LandingPageService } from '@/domain/landing-page/services/landing-page.service';

@Module({
  providers: [LandingPageService],
  exports: [LandingPageService],
})
export class LandingPageDomainModule {}
