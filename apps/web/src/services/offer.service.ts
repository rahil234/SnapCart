import { apiConfig } from '@/api/client';
import { OfferApi } from '@/api/generated';

const offerApi = new OfferApi(apiConfig);

export const OfferService = {
  getOffers: () => offerApi.offerControllerGetOffers(),
  addOffer: (newOffer: any) => offerApi.offerControllerAddOffer(newOffer),
  updateOffer: (id: string, updatedOffer: any) =>
    offerApi.offerControllerUpdateOffer(id, updatedOffer),
  getProductApplicableOffers: (productId: string) =>
    offerApi.offerControllerGetProductApplicableOffers(productId),
};
