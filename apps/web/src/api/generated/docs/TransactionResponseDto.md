# TransactionResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Transaction ID | [default to undefined]
**amount** | **number** | Transaction amount | [default to undefined]
**type** | **string** | Transaction type | [default to undefined]
**status** | **string** | Transaction status | [default to undefined]
**description** | **string** | Transaction description | [default to undefined]
**reference** | **string** | External reference | [default to undefined]
**orderId** | **string** | Associated order ID | [default to undefined]
**createdAt** | **string** | Transaction date | [default to undefined]

## Example

```typescript
import { TransactionResponseDto } from './api';

const instance: TransactionResponseDto = {
    id,
    amount,
    type,
    status,
    description,
    reference,
    orderId,
    createdAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
