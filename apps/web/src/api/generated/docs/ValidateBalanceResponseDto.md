# ValidateBalanceResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**isValid** | **boolean** | Whether wallet has sufficient balance | [default to undefined]
**currentBalance** | **number** | Current wallet balance | [default to undefined]
**requiredAmount** | **number** | Required amount for the operation | [default to undefined]
**shortfall** | **number** | Shortfall amount (0 if sufficient balance) | [default to undefined]

## Example

```typescript
import { ValidateBalanceResponseDto } from './api';

const instance: ValidateBalanceResponseDto = {
    isValid,
    currentBalance,
    requiredAmount,
    shortfall,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
