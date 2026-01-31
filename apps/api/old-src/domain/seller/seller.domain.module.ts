import { Module } from '@nestjs/common';
import { SellerService } from '@/domain/seller/services/seller.service';

@Module({
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerDomainModule {}
