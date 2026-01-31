import { Module } from '@nestjs/common';
import { SmsService } from '@/domain/sms/services/sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsDomainModule {}
