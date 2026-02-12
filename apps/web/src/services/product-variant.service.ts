import {
  CreateVariantDto,
  ProductVariantsApi,
  UpdateVariantDto,
  SaveVariantImageDto,
} from '@/api/generated';
import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const productVariantApi = new ProductVariantsApi(
  apiConfig,
  undefined,
  apiClient
);

export const ProductVariantService = {
  createVariant: (productId: string, payload: CreateVariantDto) =>
    handleRequest(() =>
      productVariantApi.variantControllerCreateVariant(productId, payload)
    ),
  updateVariant: (variantId: string, payload: UpdateVariantDto) =>
    handleRequest(() =>
      productVariantApi.variantControllerUpdateVariant(variantId, payload)
    ),
  deactivateVariant: (variantId: string) =>
    handleRequest(() =>
      productVariantApi.variantControllerDeactivateVariant(variantId)
    ),
  uploadVariantImage: (variantId: string) =>
    handleRequest(() =>
      productVariantApi.variantControllerUploadVariantImage(variantId)
    ),
  saveVariantImage: (variantId: string, payload: SaveVariantImageDto) =>
    handleRequest(() =>
      productVariantApi.variantControllerSaveVariantImage(variantId, payload)
    ),
  deleteVariantImage: (variantId: string, position: number) =>
    handleRequest(() =>
      productVariantApi.variantControllerDeleteVariantImage(variantId, position)
    ),
};
