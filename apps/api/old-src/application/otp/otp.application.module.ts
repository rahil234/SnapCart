import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OtpDomainModule } from '../../domain/otp/otp.domain.module';

@Module({
  imports: [CqrsModule, OtpDomainModule],
  exports: [OtpDomainModule],
})
export class OtpApplicationModule {}
