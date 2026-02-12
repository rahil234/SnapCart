# CartResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Cart ID | [default to undefined]
**userId** | **string** | User ID | [default to undefined]
**items** | [**Array&lt;CartItemResponseDto&gt;**](CartItemResponseDto.md) | Cart items | [default to undefined]
**totalItems** | **number** | Total number of items (sum of all quantities) | [default to undefined]
**uniqueItemsCount** | **number** | Number of unique items | [default to undefined]
**isEmpty** | **boolean** | Whether the cart is empty | [default to undefined]
**createdAt** | **string** | Created at timestamp | [default to undefined]
**updatedAt** | **string** | Updated at timestamp | [default to undefined]

## Example

```typescript
import { CartResponseDto } from './api';

const instance: CartResponseDto = {
    id,
    userId,
    items,
    totalItems,
    uniqueItemsCount,
    isEmpty,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
