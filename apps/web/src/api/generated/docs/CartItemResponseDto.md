# CartItemResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the cart item | [default to undefined]
**quantity** | **number** | Quantity of the product in the cart item | [default to undefined]
**product** | [**ProductResponsePickDto**](ProductResponsePickDto.md) | Details of the product in the cart item | [default to undefined]
**variant** | [**ProductVariantResponseDto**](ProductVariantResponseDto.md) | Details of the product variant in the cart item | [default to undefined]

## Example

```typescript
import { CartItemResponseDto } from './api';

const instance: CartItemResponseDto = {
    id,
    quantity,
    product,
    variant,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
