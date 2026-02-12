import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import { AdminBannersApi, BannersApi } from '@/api/generated';

const bannersApi = new BannersApi(apiConfig, undefined, apiClient);
const adminBannersApi = new AdminBannersApi(apiConfig, undefined, apiClient);

// Banner response type matching the backend DTO
export interface BannerResponse {
  id: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Upload descriptor types
interface CloudinaryUploadDescriptor {
  provider: 'cloudinary';
  uploadUrl: string;
  method: 'POST';
  fields: Record<string, string>;
}

export const BannerService = {
  // Public endpoints
  getActiveBanners: () =>
    handleRequest(() => bannersApi.bannerControllerFindAll(true)),

  // Admin endpoints
  getAllBanners: () =>
    handleRequest(() => adminBannersApi.adminBannerControllerFindAll()),

  getBannerById: (id: string) =>
    handleRequest(() => adminBannersApi.adminBannerControllerFindOne(id)),

  createBanner: (data: { imageUrl: string; order?: number }) =>
    handleRequest(() => adminBannersApi.adminBannerControllerCreate(data)),

  updateBanner: (id: string, data: { imageUrl?: string; isActive?: boolean }) =>
    handleRequest(() => adminBannersApi.adminBannerControllerUpdate(id, data)),

  deleteBanner: (id: string) =>
    handleRequest(() => adminBannersApi.adminBannerControllerDelete(id)),

  reorderBanners: (banners: { id: string; order: number }[]) =>
    handleRequest(() =>
      adminBannersApi.adminBannerControllerReorder({ banners })
    ),

  generateUploadUrl: (fileName: string) =>
    handleRequest(() =>
      adminBannersApi.adminBannerControllerGenerateUploadUrl({ fileName })
    ),

  // Upload image to Cloudinary using the presigned upload
  uploadToCloudinary: async (
    uploadDescriptor: CloudinaryUploadDescriptor,
    file: File | Blob
  ): Promise<string> => {
    const formData = new FormData();

    // Add all fields from the descriptor
    Object.entries(uploadDescriptor.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add the file last
    formData.append('file', file);

    const response = await fetch(uploadDescriptor.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const result = await response.json();
    return result.secure_url;
  },
};
