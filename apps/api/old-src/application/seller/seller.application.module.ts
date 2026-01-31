import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SellerDomainModule } from '../../domain/seller/seller.domain.module';
import { SellerController } from '../../infrastructure/seller/controllers/seller.controller';
import { PrismaSellerRepository } from '../../infrastructure/seller/repositories/prisma-seller.repository';
import { AdminApplicationModule } from '../admin/admin.application.module';

@Module({
  imports: [
    CqrsModule,
    SellerDomainModule,
    forwardRef(() => AdminApplicationModule),
  ],
  controllers: [SellerController],
  providers: [
    {
      provide: 'SellerRepository',
      useClass: PrismaSellerRepository,
    },
  ],
  exports: [SellerDomainModule],
})
export class SellerApplicationModule {}
