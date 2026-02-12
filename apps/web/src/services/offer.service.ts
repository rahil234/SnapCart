import {
  AdminOffersApi,
  CreateOfferDto,
  OffersApi,
  UpdateOfferDto,
} from '@/api/generated';
import { apiConfig } from '@/api/client';
import { apiClient } from '@/api/axios';
import { handleRequest } from '@/api/utils/handleRequest';

const offersApi = new OffersApi(apiConfig, undefined, apiClient);
const adminOffersApi = new AdminOffersApi(apiConfig, undefined, apiClient);

export const OfferService = {
  getOffers: () =>
    handleRequest(() => adminOffersApi.adminOfferControllerFindAll()),
  createOffer: (offer: CreateOfferDto) =>
    handleRequest(() => adminOffersApi.adminOfferControllerCreate(offer)),
  updateOffer: (id: string, updatedOffer: UpdateOfferDto) =>
    handleRequest(() =>
      adminOffersApi.adminOfferControllerUpdate(id, updatedOffer)
    ),
  activateOffer: (id: string) =>
    handleRequest(() => adminOffersApi.adminOfferControllerActivate(id)),
  deactivateOffer: (id: string) =>
    handleRequest(() => adminOffersApi.adminOfferControllerDeactivate(id)),
  getProductApplicableOffers: (productId: string) =>
    handleRequest(() => offersApi.offerControllerGetProductOffers(productId)),
};
