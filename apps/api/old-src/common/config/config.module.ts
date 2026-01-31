import Joi from 'joi';
import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().default('development'),
        PORT: Joi.number().default(4000),
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
        GCP_REGION: Joi.string().required(),
        GCP_PROJECT_ID: Joi.string().required(),
        GCP_VERTEX_MODEL_ID: Joi.string().default(
          'virtual-try-on-preview-08-04',
        ),
        GCP_CLIENT_EMAIL: Joi.string().required(),
        GCP_PRIVATE_KEY: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('3600s'),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_MSG_SERVICE_SID: Joi.string().required(),
        AZURE_STORAGE_ACCOUNT: Joi.string().required(),
        AZURE_STORAGE_KEY: Joi.string().required(),
        AZURE_STORAGE_CONTAINER: Joi.string().required(),
        SENDGRID_API_KEY: Joi.string().required(),
        SENDGRID_FROM_EMAIL: Joi.string().email().required(),
        RAZORPAY_KEY_ID: Joi.string().required(),
        RAZORPAY_KEY_SECRET: Joi.string().required(),
        RAZORPAY_WEBHOOK_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
