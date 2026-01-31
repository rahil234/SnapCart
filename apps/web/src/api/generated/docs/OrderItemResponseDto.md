# OrderItemResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**product** | [**ProductPickDto**](ProductPickDto.md) |  | [default to undefined]
**variant** | [**ProductVariantResponseDto**](ProductVariantResponseDto.md) | Variant of the product | [default to undefined]
**quantity** | **number** | number of units of the product variant ordered | [default to undefined]
**subtotal** | **number** | subtotal price for the product variant (quantity x unit price) | [default to undefined]

## Example

```typescript
import { OrderItemResponseDto } from './api';

const instance: OrderItemResponseDto = {
    product,
    variant,
    quantity,
    subtotal,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
