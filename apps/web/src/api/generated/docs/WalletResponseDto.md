# WalletResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Wallet ID | [default to undefined]
**customerId** | **string** | Customer ID | [default to undefined]
**balance** | **number** | Current wallet balance | [default to undefined]
**currency** | **string** | Currency code | [default to undefined]
**isActive** | **boolean** | Whether the wallet is active | [default to undefined]
**createdAt** | **string** | Wallet creation date | [default to undefined]
**updatedAt** | **string** | Wallet last update date | [default to undefined]

## Example

```typescript
import { WalletResponseDto } from './api';

const instance: WalletResponseDto = {
    id,
    customerId,
    balance,
    currency,
    isActive,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
