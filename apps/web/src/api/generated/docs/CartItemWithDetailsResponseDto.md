# CartItemWithDetailsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Cart item ID | [default to undefined]
**cartId** | **string** | Cart ID | [default to undefined]
**productVariantId** | **string** | Product variant ID | [default to undefined]
**quantity** | **number** | Quantity of the item | [default to undefined]
**variant** | [**ProductVariantDetailDto**](ProductVariantDetailDto.md) | Product variant details | [default to undefined]
**subtotal** | **number** | Subtotal (quantity × final price) | [default to undefined]
**createdAt** | **string** | Created at timestamp | [default to undefined]
**updatedAt** | **string** | Updated at timestamp | [default to undefined]

## Example

```typescript
import { CartItemWithDetailsResponseDto } from './api';

const instance: CartItemWithDetailsResponseDto = {
    id,
    cartId,
    productVariantId,
    quantity,
    variant,
    subtotal,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
