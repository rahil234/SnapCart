export * from './create-product.handler';
export * from './update-product.handler';
export * from './create-variant.handler';
export * from './update-variant.handler';
export * from './update-variant-stock.handler';

// Export array for easy module registration
export const CommandHandlers = [
  require('./create-product.handler').CreateProductHandler,
  require('./update-product.handler').UpdateProductHandler,
  require('./create-variant.handler').CreateVariantHandler,
  require('./update-variant.handler').UpdateVariantHandler,
  require('./update-variant-stock.handler').UpdateVariantStockHandler,
];

