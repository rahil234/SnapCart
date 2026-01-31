import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { FeedController } from '@/modules/feed/interfaces/http/feed.controller';
import { PrismaCategoryProductFeedRepository } from '@/modules/feed/infrastructure/persistence/prisma-category-product-feed.repository';

// Query Handlers
import { GetCategoryProductFeedHandler } from '@/modules/feed/application/queries/handlers';

export const FeedQueryHandlers = [GetCategoryProductFeedHandler];

@Module({
  imports: [CqrsModule, ConfigModule],
  controllers: [FeedController],
  providers: [
    ...FeedQueryHandlers,
    {
      provide: 'CategoryProductFeedRepository',
      useClass: PrismaCategoryProductFeedRepository,
    },
  ],
})
export class FeedHttpModule {}
