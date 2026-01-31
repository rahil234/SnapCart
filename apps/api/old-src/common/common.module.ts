import { Global, Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  providers: [BcryptService, PrismaService],
  exports: [BcryptService, PrismaService],
})
export class CommonModule {}
