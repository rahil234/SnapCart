import { Module } from '@nestjs/common';

import { FeedHttpModule } from '@/modules/feed/interfaces/http/feed.http.module';

@Module({
  imports: [FeedHttpModule],
})
export class FeedModule {}
