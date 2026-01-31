import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminDomainModule } from '../../domain/admin/admin.domain.module';
import { AdminController } from '../../infrastructure/admin/controllers/admin.controller';
import { UserApplicationModule } from '../user/user.application.module';
import { PrismaAdminRepository } from '../../infrastructure/admin/repositories/prisma-admin.repository';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    CqrsModule,
    AdminDomainModule,
    forwardRef(() => UserApplicationModule),
    CommonModule,
  ],
  controllers: [AdminController],
  providers: [
    {
      provide: 'AdminRepository',
      useClass: PrismaAdminRepository,
    },
  ],
  exports: [AdminDomainModule],
})
export class AdminApplicationModule {}
