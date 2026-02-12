# CouponUsageResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Usage record ID | [default to undefined]
**couponId** | **string** | Coupon ID | [default to undefined]
**userId** | **string** | User ID who used the coupon | [default to undefined]
**orderId** | **string** | Order ID where coupon was applied | [optional] [default to undefined]
**discountApplied** | **number** | Discount amount that was applied | [default to undefined]
**usedAt** | **string** | When the coupon was used | [default to undefined]

## Example

```typescript
import { CouponUsageResponseDto } from './api';

const instance: CouponUsageResponseDto = {
    id,
    couponId,
    userId,
    orderId,
    discountApplied,
    usedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
