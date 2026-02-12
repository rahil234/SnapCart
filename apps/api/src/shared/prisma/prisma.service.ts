import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect().catch((reason) => {
      console.error('Prisma connection error:', reason);
      process.exit(1);
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
