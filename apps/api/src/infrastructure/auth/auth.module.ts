import { Module } from '@nestjs/common';

import { JwtModule } from '@/infrastructure/auth/jwt/jwt.module';

@Module({
  imports: [JwtModule],
})
export class AuthModule {}
