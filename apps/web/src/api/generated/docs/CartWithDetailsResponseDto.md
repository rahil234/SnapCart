# CartWithDetailsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Cart ID | [default to undefined]
**customerId** | **string** | Customer ID | [default to undefined]
**items** | [**Array&lt;CartItemWithDetailsResponseDto&gt;**](CartItemWithDetailsResponseDto.md) | Cart items with full product details | [default to undefined]
**totalItems** | **number** | Total number of items (sum of all quantities) | [default to undefined]
**uniqueItemsCount** | **number** | Number of unique items | [default to undefined]
**totalAmount** | **number** | Total amount (sum of all subtotals) | [default to undefined]
**isEmpty** | **boolean** | Whether the cart is empty | [default to undefined]
**createdAt** | **string** | Created at timestamp | [default to undefined]
**updatedAt** | **string** | Updated at timestamp | [default to undefined]

## Example

```typescript
import { CartWithDetailsResponseDto } from './api';

const instance: CartWithDetailsResponseDto = {
    id,
    customerId,
    items,
    totalItems,
    uniqueItemsCount,
    totalAmount,
    isEmpty,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
