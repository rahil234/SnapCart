import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import { ConfigModule } from '@/shared/config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class SharedModule {}
