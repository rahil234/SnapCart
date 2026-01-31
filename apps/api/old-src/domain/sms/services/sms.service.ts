import { Injectable, InternalServerErrorException } from '@nestjs/common';
import twilio, { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';
import { logger } from '@/common/logger/winston-logger';

@Injectable()
export class SmsService {
  private _client: Twilio;
  private readonly _sender: string;

  constructor(private readonly _configService: ConfigService) {
    this._client = twilio(
      this._configService.getOrThrow('TWILIO_ACCOUNT_SID'),
      this._configService.getOrThrow('TWILIO_AUTH_TOKEN'),
    );
    this._sender = this._configService.getOrThrow('TWILIO_MSG_SERVICE_SID');
  }

  async sendSMS(to: string, message: string): Promise<void> {
    try {
      await this._client.messages.create({
        body: message,
        from: this._sender,
        to,
      });
      logger.info(`✅ SMS sent to ${to}`);
    } catch (error) {
      logger.error(`❌ Failed to send SMS: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to send SMS');
    }
  }
}
