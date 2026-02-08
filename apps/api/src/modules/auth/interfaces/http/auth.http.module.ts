import { Module } from '@nestjs/common';

import { AuthController } from '@/modules/auth/interfaces/http/auth.controller';

import { AuthApplicationModule } from '@/modules/auth/application/auth.application.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, AuthApplicationModule],
  controllers: [AuthController],
})
export class AuthHttpModule {}
