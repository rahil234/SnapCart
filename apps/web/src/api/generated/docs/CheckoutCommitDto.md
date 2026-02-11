# CheckoutCommitDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**source** | **string** | Checkout source - where checkout is initiated from | [default to undefined]
**couponCode** | **string** | Coupon code to apply | [optional] [default to undefined]
**shippingAddressId** | **string** | Shipping address ID | [default to undefined]
**paymentMethod** | **string** | Payment method | [default to undefined]

## Example

```typescript
import { CheckoutCommitDto } from './api';

const instance: CheckoutCommitDto = {
    source,
    couponCode,
    shippingAddressId,
    paymentMethod,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
