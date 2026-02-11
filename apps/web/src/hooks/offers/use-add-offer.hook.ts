import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Offer } from '@/types';
import { OfferService } from '@/services/offer.service';

export const useAddOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Offer, 'id'>) => OfferService.createOffer(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};
