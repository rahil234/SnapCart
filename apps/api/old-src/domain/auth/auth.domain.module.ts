import { Module } from '@nestjs/common';
import { AuthService } from '@/domain/auth/services/auth.service';
import { GoogleService } from '@/domain/auth/services/google.service';

@Module({
  providers: [AuthService, GoogleService],
  exports: [AuthService, GoogleService],
})
export class AuthDomainModule {}
