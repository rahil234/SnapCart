import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Offer } from '@/types';
import { OfferService } from '@/services/offer.service';

export const useEditOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Offer) => OfferService.updateOffer(data.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });
};
