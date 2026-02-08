# CouponValidationResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**valid** | **boolean** | Whether the coupon is valid | [default to undefined]
**reason** | **string** | Reason if coupon is invalid | [optional] [default to undefined]
**discount** | **number** | Discount amount that will be applied | [optional] [default to undefined]
**code** | **string** | Coupon code that was validated | [optional] [default to undefined]

## Example

```typescript
import { CouponValidationResponseDto } from './api';

const instance: CouponValidationResponseDto = {
    valid,
    reason,
    discount,
    code,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
