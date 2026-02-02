import { apiConfig } from '@/api/client';
import { FeedsApi, UsersApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const feedApi = new FeedsApi(apiConfig);
const userApi = new UsersApi(apiConfig);

export const FeedService = {
  getHomeFeed: () => handleRequest(() => feedApi.feedControllerGetFeed()),
};
