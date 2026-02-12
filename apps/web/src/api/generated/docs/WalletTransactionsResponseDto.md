# WalletTransactionsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**transactions** | [**Array&lt;TransactionResponseDto&gt;**](TransactionResponseDto.md) | List of transactions | [default to undefined]
**total** | **number** | Total number of transactions | [default to undefined]
**limit** | **number** | Number of transactions returned | [default to undefined]
**offset** | **number** | Offset from start | [default to undefined]

## Example

```typescript
import { WalletTransactionsResponseDto } from './api';

const instance: WalletTransactionsResponseDto = {
    transactions,
    total,
    limit,
    offset,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
