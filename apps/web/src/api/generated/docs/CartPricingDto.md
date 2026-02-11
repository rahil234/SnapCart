# CartPricingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**subtotal** | **number** | Subtotal before any discounts | [default to undefined]
**offerDiscount** | **number** | Total discount from offers | [default to undefined]
**couponDiscount** | **number** | Discount from applied coupon | [default to undefined]
**totalDiscount** | **number** | Total discount amount | [default to undefined]
**finalTotal** | **number** | Final total after all discounts | [default to undefined]
**appliedOfferIds** | **Array&lt;string&gt;** | IDs of applied offers | [default to undefined]
**appliedCouponCode** | **string** | Applied coupon code | [optional] [default to undefined]
**savings** | **number** | Total savings from all discounts | [default to undefined]
**appliedOffers** | [**Array&lt;AppliedOfferDto&gt;**](AppliedOfferDto.md) | List of applied offers with details | [default to undefined]

## Example

```typescript
import { CartPricingDto } from './api';

const instance: CartPricingDto = {
    subtotal,
    offerDiscount,
    couponDiscount,
    totalDiscount,
    finalTotal,
    appliedOfferIds,
    appliedCouponCode,
    savings,
    appliedOffers,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
