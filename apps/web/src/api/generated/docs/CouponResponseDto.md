# CouponResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Coupon ID | [default to undefined]
**code** | **string** | Coupon code | [default to undefined]
**type** | **string** | Discount type | [default to undefined]
**discount** | **number** | Discount value | [default to undefined]
**minAmount** | **number** | Minimum cart amount required | [default to undefined]
**maxDiscount** | **number** | Maximum discount amount | [optional] [default to undefined]
**startDate** | **string** | Coupon start date | [default to undefined]
**endDate** | **string** | Coupon end date | [default to undefined]
**status** | **string** | Coupon status | [default to undefined]
**usageLimit** | **number** | Total usage limit | [optional] [default to undefined]
**usedCount** | **number** | Times this coupon has been used | [default to undefined]
**maxUsagePerUser** | **number** | Maximum times a user can use this coupon | [default to undefined]
**applicableTo** | **string** | Applicability scope | [default to undefined]
**isStackable** | **boolean** | Can be stacked with offers | [default to undefined]
**description** | **string** | Coupon description | [optional] [default to undefined]
**isActive** | **boolean** | Whether coupon is currently active | [default to undefined]
**isLimitReached** | **boolean** | Whether usage limit is reached | [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { CouponResponseDto } from './api';

const instance: CouponResponseDto = {
    id,
    code,
    type,
    discount,
    minAmount,
    maxDiscount,
    startDate,
    endDate,
    status,
    usageLimit,
    usedCount,
    maxUsagePerUser,
    applicableTo,
    isStackable,
    description,
    isActive,
    isLimitReached,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
