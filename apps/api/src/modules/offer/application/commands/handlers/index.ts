export * from './create-offer.handler';
export * from './update-offer.handler';
export * from './activate-offer.handler';
export * from './deactivate-offer.handler';

import { CreateOfferHandler } from './create-offer.handler';
import { UpdateOfferHandler } from './update-offer.handler';
import { ActivateOfferHandler } from './activate-offer.handler';
import { DeactivateOfferHandler } from './deactivate-offer.handler';

const CommandHandlers = [
  CreateOfferHandler,
  UpdateOfferHandler,
  ActivateOfferHandler,
  DeactivateOfferHandler,
];

export default CommandHandlers;
