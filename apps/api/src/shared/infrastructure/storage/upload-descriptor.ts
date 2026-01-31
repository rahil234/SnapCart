export type UploadDescriptor =
  | {
      provider: 'azure';
      uploadUrl: string;
      readUrl: string;
      method: 'PUT';
    }
  | {
      provider: 'cloudinary';
      uploadUrl: string;
      method: 'POST';
      fields: Record<string, string>;
    };
