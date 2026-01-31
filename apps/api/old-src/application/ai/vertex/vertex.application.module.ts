import Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { VertexDomainModule } from '../../../domain/ai/vertex/vertex.domain.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        GCP_REGION: Joi.string().required(),
        GCP_PROJECT_ID: Joi.string().required(),
        GCP_VERTEX_MODEL_ID: Joi.string().default(
          'virtual-try-on-preview-08-04',
        ),
        GCP_CLIENT_EMAIL: Joi.string().required(),
        GCP_PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    VertexDomainModule,
  ],
  exports: [VertexDomainModule],
})
export class VertexApplicationModule {}
