import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';

@Global()
@Module({
  providers: [{ provide: 'PrismaService', useClass: PrismaService }],
  exports: ['PrismaService'],
})
export class PrismaModule {}
