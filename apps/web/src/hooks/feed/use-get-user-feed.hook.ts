import { useSuspenseQuery } from '@tanstack/react-query';

import { FeedService } from '@/services/feed.service';

export const useGetUserFeed = () => {
  return useSuspenseQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const { data, error } = await FeedService.getHomeFeed();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
