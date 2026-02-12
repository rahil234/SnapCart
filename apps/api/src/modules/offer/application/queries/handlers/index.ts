export * from './get-offer.handler';
export * from './get-all-offers.handler';
export * from './get-active-offers.handler';
export * from './get-product-offers.handler';

import { GetOfferHandler } from './get-offer.handler';
import { GetAllOffersHandler } from './get-all-offers.handler';
import { GetActiveOffersHandler } from './get-active-offers.handler';
import { GetProductOffersHandler } from './get-product-offers.handler';

const QueryHandlers = [
  GetOfferHandler,
  GetAllOffersHandler,
  GetActiveOffersHandler,
  GetProductOffersHandler,
];

export default QueryHandlers;
