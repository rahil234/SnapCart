import { useQuery } from '@tanstack/react-query';

import { OfferService } from '@/services/offer.service';

export const useGetOffers = () => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const { data, error } = await OfferService.getOffers();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};
