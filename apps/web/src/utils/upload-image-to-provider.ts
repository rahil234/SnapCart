interface UploadImageDescriptor {
  /**
   * Image storage provider
   */
  provider: string;
  /**
   * URL of the storage bucket to upload the image to
   */
  uploadUrl: string;
  /**
   * HTTP method to use for upload
   */
  method: string;
  /**
   * URL to read/access the uploaded image
   */
  readUrl?: string;
  /**
   * Additional fields required for the upload
   */
  fields?: object;
}

export async function uploadImageToProvider(
  descriptor: UploadImageDescriptor,
  file: File
): Promise<{
  provider: string;
  publicId: string;
  url: string;
}> {
  const { fields, provider } = descriptor;

  switch (provider) {
    case 'cloudinary': {
      const formData = new FormData();

      if (!fields) {
        throw new Error('Missing fields for Cloudinary upload');
      }

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

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

    default: {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
