# UpdateCouponDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code** | **string** | Unique coupon code | [optional] [default to undefined]
**type** | **string** | Type of discount | [optional] [default to undefined]
**discount** | **number** | Discount value | [optional] [default to undefined]
**minAmount** | **number** | Minimum cart amount | [optional] [default to undefined]
**maxDiscount** | **number** | Maximum discount amount | [optional] [default to undefined]
**startDate** | **string** | Start date | [optional] [default to undefined]
**endDate** | **string** | End date | [optional] [default to undefined]
**usageLimit** | **number** | Total usage limit | [optional] [default to undefined]
**maxUsagePerUser** | **number** | Max usage per user | [optional] [default to undefined]
**applicableTo** | **string** | Applicability scope | [optional] [default to undefined]
**isStackable** | **boolean** | Stackable with offers | [optional] [default to undefined]
**description** | **string** | Coupon description | [optional] [default to undefined]

## Example

```typescript
import { UpdateCouponDto } from './api';

const instance: UpdateCouponDto = {
    code,
    type,
    discount,
    minAmount,
    maxDiscount,
    startDate,
    endDate,
    usageLimit,
    maxUsagePerUser,
    applicableTo,
    isStackable,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
