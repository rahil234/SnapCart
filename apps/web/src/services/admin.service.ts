import { AdminApi } from '@/api/generated';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const adminApi = new AdminApi(apiConfig);

export const AdminService = {
  getBanners: () => handleRequest(adminApi.adminControllerGetBanners),

  uploadBannerImage: async (data: FormData) => {
    return adminApi.adminControllerUploadBannerImage(data);
  },

  updateBannerOrder: async (
    updatedBanners: { id: number; order: number }[]
  ) => {
    return handleRequest(async () =>
      adminApi.adminControllerUpdateBannerOrder({
        banners: updatedBanners,
      })
    );
  },

  saveBanners: async (
    banners: { _id: number; image: string; order: number }[]
  ) => {
    return adminApi.adminControllerSaveBanners({ banners });
  },

  deleteBanner: async (bannerId: string) => {
    return adminApi.adminControllerDeleteBanner(bannerId);
  },
};
