# CheckoutCommitResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Order ID | [default to undefined]
**orderNumber** | **string** | Order number | [default to undefined]
**subtotal** | **number** | Subtotal before any discounts | [default to undefined]
**discount** | **number** | Product-level discount | [default to undefined]
**couponDiscount** | **number** | Coupon discount applied | [default to undefined]
**offerDiscount** | **number** | Offer discount applied | [default to undefined]
**shippingCharge** | **number** | Shipping charge | [default to undefined]
**tax** | **number** | Tax amount | [default to undefined]
**total** | **number** | Final total amount | [default to undefined]
**appliedCouponCode** | **object** | Applied coupon code | [optional] [default to undefined]
**items** | **Array&lt;object&gt;** | Order items | [default to undefined]
**paymentStatus** | **string** | Payment status | [default to undefined]
**orderStatus** | **string** | Order status | [default to undefined]

## Example

```typescript
import { CheckoutCommitResponseDto } from './api';

const instance: CheckoutCommitResponseDto = {
    id,
    orderNumber,
    subtotal,
    discount,
    couponDiscount,
    offerDiscount,
    shippingCharge,
    tax,
    total,
    appliedCouponCode,
    items,
    paymentStatus,
    orderStatus,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
