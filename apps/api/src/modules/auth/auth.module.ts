import { Module } from '@nestjs/common';

import { AuthHttpModule } from '@/modules/auth/interfaces/http/auth.http.module';

@Module({
  imports: [AuthHttpModule],
  exports: [AuthHttpModule],
})
export class AuthModule {}
