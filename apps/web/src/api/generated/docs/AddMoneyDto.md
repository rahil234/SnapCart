# AddMoneyDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**amount** | **number** | Amount to add to wallet | [default to undefined]
**description** | **string** | Description for the transaction | [optional] [default to undefined]
**reference** | **string** | External reference (e.g., payment gateway transaction ID) | [optional] [default to undefined]

## Example

```typescript
import { AddMoneyDto } from './api';

const instance: AddMoneyDto = {
    amount,
    description,
    reference,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
