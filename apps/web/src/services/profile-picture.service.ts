import axios from 'axios';
import { apiClient } from '@/api/axios';

export interface CloudinaryUploadDescriptor {
  provider: 'cloudinary';
  uploadUrl: string;
  method: 'POST';
  fields: Record<string, string>;
}

export const ProfilePictureService = {
  /**
   * Generate upload URL for profile picture
   */
  generateUploadUrl: async (fileName: string) => {
    const response = await apiClient.post(
      '/api/users/profile-picture/generate-upload-url',
      {
        fileName,
      }
    );
    return { data: response.data.data, error: null };
  },

  /**
   * Upload profile picture to Cloudinary
   */
  uploadToCloudinary: async (
    uploadDescriptor: CloudinaryUploadDescriptor,
    imageBlob: Blob
  ): Promise<string> => {
    const formData = new FormData();

    // Add all fields from the upload descriptor
    Object.entries(uploadDescriptor.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add the file
    formData.append('file', imageBlob);

    // Upload to Cloudinary
    const response = await axios.post(uploadDescriptor.uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the secure URL from Cloudinary response
    return response.data.secure_url;
  },

  /**
   * Save profile picture URL after upload
   */
  saveProfilePicture: async (url: string) => {
    const response = await apiClient.post('/api/users/profile-picture', {
      url,
    });
    return { data: response.data, error: null };
  },

  /**
   * Complete upload flow: generate URL, upload, and save
   */
  uploadProfilePicture: async (imageBlob: Blob): Promise<string> => {
    // Generate a unique file name
    const fileName = `profile_${Date.now()}.jpg`;

    // Step 1: Generate upload URL
    const uploadResult =
      await ProfilePictureService.generateUploadUrl(fileName);

    if (uploadResult.error) {
      throw new Error(uploadResult.error || 'Failed to generate upload URL');
    }

    const uploadDescriptor = uploadResult.data!;

    // Step 2: Upload to Cloudinary
    if (uploadDescriptor.provider !== 'cloudinary') {
      throw new Error('Only Cloudinary provider is supported');
    }

    const imageUrl = await ProfilePictureService.uploadToCloudinary(
      uploadDescriptor as CloudinaryUploadDescriptor,
      imageBlob
    );

    // Step 3: Save URL to backend
    const saveResult = await ProfilePictureService.saveProfilePicture(imageUrl);

    if (saveResult.error) {
      throw new Error(saveResult.error || 'Failed to save profile picture');
    }

    return imageUrl;
  },
};
