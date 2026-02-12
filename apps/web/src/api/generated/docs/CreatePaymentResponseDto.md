# CreatePaymentResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Razorpay order ID | [default to undefined]
**entity** | **string** | Entity type | [default to undefined]
**amount** | **number** | Amount in paise | [default to undefined]
**currency** | **string** | Currency code | [default to undefined]
**receipt** | **string** | Receipt identifier | [default to undefined]
**status** | **string** | Order status | [default to undefined]

## Example

```typescript
import { CreatePaymentResponseDto } from './api';

const instance: CreatePaymentResponseDto = {
    id,
    entity,
    amount,
    currency,
    receipt,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
