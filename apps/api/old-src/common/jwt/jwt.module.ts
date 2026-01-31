import { Module } from '@nestjs/common';

import { JwtService } from '@/common/jwt/jwt.service';

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
