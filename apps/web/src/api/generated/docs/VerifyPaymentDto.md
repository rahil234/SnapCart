# VerifyPaymentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**razorpay_order_id** | **string** | Razorpay order ID | [default to undefined]
**razorpay_payment_id** | **string** | Razorpay payment ID | [default to undefined]
**razorpay_signature** | **string** | Razorpay signature for verification | [default to undefined]
**orderId** | **string** | Our internal order ID | [default to undefined]

## Example

```typescript
import { VerifyPaymentDto } from './api';

const instance: VerifyPaymentDto = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
