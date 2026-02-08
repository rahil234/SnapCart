export * from './create-coupon.handler';
export * from './update-coupon.handler';
export * from './activate-coupon.handler';
export * from './deactivate-coupon.handler';
export * from './validate-coupon.handler';

import { CreateCouponHandler } from './create-coupon.handler';
import { UpdateCouponHandler } from './update-coupon.handler';
import { ActivateCouponHandler } from './activate-coupon.handler';
import { DeactivateCouponHandler } from './deactivate-coupon.handler';
import { ValidateCouponHandler } from './validate-coupon.handler';

const CommandHandlers = [
  CreateCouponHandler,
  UpdateCouponHandler,
  ActivateCouponHandler,
  DeactivateCouponHandler,
  ValidateCouponHandler,
];

export default CommandHandlers;
