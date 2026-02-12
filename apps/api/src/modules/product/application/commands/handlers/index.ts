import { SaveVariantImageHandler } from '@/modules/product/application/commands/handlers/save-variant-image.handler';
import { CreateProductHandler } from '@/modules/product/application/commands/handlers/create-product.handler';
import { UpdateProductHandler } from '@/modules/product/application/commands/handlers/update-product.handler';
import { ActivateProductHandler } from '@/modules/product/application/commands/handlers/activate-product.handler';
import { DeactivateProductHandler } from '@/modules/product/application/commands/handlers/deactivate-product.handler';
import { DiscontinueProductHandler } from '@/modules/product/application/commands/handlers/discontinue-product.handler';
import { UpdateProductStatusHandler } from '@/modules/product/application/commands/handlers/update-product-status.handler';
import { CreateVariantHandler } from '@/modules/product/application/commands/handlers/create-variant.handler';
import { UpdateVariantHandler } from '@/modules/product/application/commands/handlers/update-variant.handler';
import { UpdateVariantStockHandler } from '@/modules/product/application/commands/handlers/update-variant-stock.handler';
import { GeneratePresignedImageUploadHandler } from '@/modules/product/application/commands/handlers/generate-presigned-image-upload.handler';
import { DeleteVariantImageHandler } from '@/modules/product/application/commands/handlers/delete-variant-image.handler';

// Export array for easy module registration
const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  ActivateProductHandler,
  DeactivateProductHandler,
  DiscontinueProductHandler,
  UpdateProductStatusHandler,
  CreateVariantHandler,
  UpdateVariantHandler,
  UpdateVariantStockHandler,
  GeneratePresignedImageUploadHandler,
  SaveVariantImageHandler,
  DeleteVariantImageHandler,
];

export {
  CreateProductHandler,
  UpdateProductHandler,
  ActivateProductHandler,
  DeactivateProductHandler,
  DiscontinueProductHandler,
  UpdateProductStatusHandler,
  CreateVariantHandler,
  UpdateVariantHandler,
  UpdateVariantStockHandler,
  GeneratePresignedImageUploadHandler,
  SaveVariantImageHandler,
  DeleteVariantImageHandler,
};

export default CommandHandlers;
