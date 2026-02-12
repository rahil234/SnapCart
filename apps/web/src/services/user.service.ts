import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';
import {
  GenerateProfilePictureUploadUrlDto,
  SaveProfilePictureDto,
  UpdateUserDto,
  UpdateUserStatusDto,
  UsersApi,
} from '@/api/generated';

const userApi = new UsersApi(apiConfig, undefined, apiClient);

export const UserService = {
  getUsers: () => handleRequest(() => userApi.userControllerFindAll()),
  getMe: () => handleRequest(() => userApi.userControllerGetMe()),
  updateMe: (dto: UpdateUserDto) =>
    handleRequest(() => userApi.userControllerUpdate(dto)),
  updateStatus: (userId: string, dto: UpdateUserStatusDto) =>
    handleRequest(() => userApi.userControllerUpdateStatus(userId, dto)),

  generateProfilePictureUploadUrl: (dto: GenerateProfilePictureUploadUrlDto) =>
    handleRequest(() =>
      userApi.userControllerGenerateProfilePictureUploadUrl(dto)
    ),
  saveProfilePicture: (dto: SaveProfilePictureDto) =>
    handleRequest(() => userApi.userControllerSaveProfilePicture(dto)),
};
