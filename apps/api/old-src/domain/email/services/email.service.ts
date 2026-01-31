import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from '@/common/logger/winston-logger';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly sender: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('SENDGRID_API_KEY');
    this.sender = this.configService.getOrThrow<string>('SENDGRID_FROM_EMAIL');
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const msg = {
      to,
      from: this.sender,
      subject,
      text,
      html: html ?? `<p>${text}</p>`,
    };

    try {
      await sgMail.send(msg);
      logger.info(`✅ Email sent to ${to}`);
    } catch (error) {
      logger.error(`❌ Failed to send email: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
