import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { PrismaService } from '@/shared/prisma/prisma.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
      }),
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
