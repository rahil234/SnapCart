import { CreateBannerHandler } from './create-banner.handler';
import { UpdateBannerHandler } from './update-banner.handler';
import { DeleteBannerHandler } from './delete-banner.handler';
import { ReorderBannersHandler } from './reorder-banners.handler';
import { GenerateBannerUploadUrlHandler } from './generate-banner-upload-url.handler';

export default [
  CreateBannerHandler,
  UpdateBannerHandler,
  DeleteBannerHandler,
  ReorderBannersHandler,
  GenerateBannerUploadUrlHandler,
];
