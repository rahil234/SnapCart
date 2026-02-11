import {
  CheckoutApi,
  CheckoutCommitDto,
  CheckoutPreviewDto,
} from '@/api/generated';
import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const checkoutApi = new CheckoutApi(apiConfig, undefined, apiClient);

export const CheckoutService = {
  previewCheckout: (payload: CheckoutPreviewDto) =>
    handleRequest(() => checkoutApi.checkoutControllerPreviewCheckout(payload)),
  commitCheckout: (payload: CheckoutCommitDto) =>
    handleRequest(() => checkoutApi.checkoutControllerCommitCheckout(payload)),
};
