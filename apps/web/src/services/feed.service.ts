import { apiConfig } from '@/api/client';
import { FeedsApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const feedApi = new FeedsApi(apiConfig);

export const FeedService = {
  getHomeFeed: () => handleRequest(() => feedApi.feedControllerGetFeed()),
};
