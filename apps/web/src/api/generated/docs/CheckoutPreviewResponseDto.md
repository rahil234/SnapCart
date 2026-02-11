# CheckoutPreviewResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**subtotal** | **number** | Subtotal before any discounts | [default to undefined]
**productDiscount** | **number** | Product-level discount | [default to undefined]
**couponDiscount** | **number** | Coupon discount applied | [default to undefined]
**offerDiscount** | **number** | Offer discount applied | [default to undefined]
**shippingCharge** | **number** | Shipping charge | [default to undefined]
**tax** | **number** | Tax amount | [default to undefined]
**total** | **number** | Final total amount | [default to undefined]
**couponSnapshot** | [**CouponSnapshotDto**](CouponSnapshotDto.md) | Applied coupon details | [optional] [default to undefined]

## Example

```typescript
import { CheckoutPreviewResponseDto } from './api';

const instance: CheckoutPreviewResponseDto = {
    subtotal,
    productDiscount,
    couponDiscount,
    offerDiscount,
    shippingCharge,
    tax,
    total,
    couponSnapshot,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
