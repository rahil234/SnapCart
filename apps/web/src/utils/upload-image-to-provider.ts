import { UploadVariantImageResponseDto } from '@/api/generated';

export async function uploadImageToProvider(
  descriptor: UploadVariantImageResponseDto,
  file: File
): Promise<{
  provider: string;
  publicId: string;
  url: string;
}> {
  switch (descriptor.provider) {
    case 'cloudinary': {
      const formData = new FormData();

      // Cloudinary expects fields first
      Object.entries(descriptor.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Actual file
      formData.set('file', file);

      const response = await fetch(descriptor.uploadUrl, {
        method: descriptor.method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const result = await response.json();

      return {
        provider: 'cloudinary',
        publicId: result.public_id,
        url: result.secure_url,
      };
    }

    case 'azure': {
      const response = await fetch(descriptor.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Azure upload failed');
      }

      return {
        provider: 'azure',
        url: descriptor.readUrl,
      };
    }

    default: {
      return descriptor;
    }
  }
}
