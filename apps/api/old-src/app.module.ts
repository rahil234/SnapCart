import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { CommonModule } from '@/common/common.module';
import { RolesGuard } from '@/common/guards/roles.guard';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Module({
  imports: [CommonModule, PrismaModule, LoggerModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
