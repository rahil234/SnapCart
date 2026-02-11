# OrderItemResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**productId** | **string** | Product ID | [default to undefined]
**productName** | **string** | Product name | [default to undefined]
**variantId** | **string** | Variant ID | [default to undefined]
**variantName** | **string** | Variant name | [default to undefined]
**quantity** | **number** | Quantity ordered | [default to undefined]
**basePrice** | **number** | Base price per item | [default to undefined]
**discountPercent** | **number** | Discount percentage applied | [default to undefined]
**finalPrice** | **number** | Final price per item after discount | [default to undefined]
**totalPrice** | **number** | Total price for this item | [default to undefined]
**attributes** | **object** | Product variant attributes | [default to undefined]
**imageUrl** | **string** | Product image URL | [default to undefined]

## Example

```typescript
import { OrderItemResponseDto } from './api';

const instance: OrderItemResponseDto = {
    productId,
    productName,
    variantId,
    variantName,
    quantity,
    basePrice,
    discountPercent,
    finalPrice,
    totalPrice,
    attributes,
    imageUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
