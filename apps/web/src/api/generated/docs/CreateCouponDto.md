# CreateCouponDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | Unique coupon code (will be converted to uppercase) | [default to undefined]
**type** | **string** | Type of discount | [default to undefined]
**discount** | **number** | Discount value (percentage or flat amount) | [default to undefined]
**minAmount** | **number** | Minimum cart amount required to use coupon | [default to 0]
**startDate** | **string** | Coupon start date | [default to undefined]
**endDate** | **string** | Coupon end date | [default to undefined]
**maxDiscount** | **number** | Maximum discount amount (for percentage coupons) | [optional] [default to undefined]
**usageLimit** | **number** | Total usage limit for this coupon | [optional] [default to undefined]
**maxUsagePerUser** | **number** | Maximum times a single user can use this coupon | [default to 1]
**applicableTo** | **string** | Applicability scope | [default to ApplicableToEnum_All]
**isStackable** | **boolean** | Whether coupon can be combined with offers | [default to false]
**description** | **string** | Coupon description for users | [optional] [default to undefined]

## Example

```typescript
import { CreateCouponDto } from './api';

const instance: CreateCouponDto = {
    code,
    type,
    discount,
    minAmount,
    startDate,
    endDate,
    maxDiscount,
    usageLimit,
    maxUsagePerUser,
    applicableTo,
    isStackable,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
