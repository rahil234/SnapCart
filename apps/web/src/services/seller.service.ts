import { apiConfig } from '@/api/client';
import { SellerApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const sellerApi = new SellerApi(apiConfig);

export const SellerService = {
  addSeller: (data: { firstName: string; email: string; password: string }) =>
    handleRequest(() => sellerApi.sellerControllerAddSeller(data)),
  getSellers: () => handleRequest(sellerApi.sellerControllerGetSellers),
  getMe: () => sellerApi.sellerControllerGetMe(),
  blockSeller: (sellerId: string) =>
    sellerApi.sellerControllerBlockSeller(sellerId),
  allowSeller: (sellerId: string) =>
    sellerApi.sellerControllerAllowSeller(sellerId),
};
