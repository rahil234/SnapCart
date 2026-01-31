import { Module } from '@nestjs/common';
import { AdminService } from '@/domain/admin/services/admin.service';

@Module({
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminDomainModule {}
