import { GetProductByIdHandler } from './get-product-by-id.handler';
import { GetProductsHandler } from './get-products.handler';
import { GetSellerProductsHandler } from './get-seller-products.handler';
import { GetAdminProductsHandler } from './get-admin-products.handler';
import { GetVariantByIdHandler } from './get-variant-by-id.handler';
import { GetVariantsByProductIdHandler } from './get-variants-by-product-id.handler';

const QueryHandlers = [
  GetProductByIdHandler,
  GetProductsHandler,
  GetSellerProductsHandler,
  GetAdminProductsHandler,
  GetVariantByIdHandler,
  GetVariantsByProductIdHandler,
];

export default QueryHandlers;
