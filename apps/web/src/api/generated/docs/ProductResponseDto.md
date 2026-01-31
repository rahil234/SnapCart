# ProductResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Product ID | [default to undefined]
**name** | **string** | Product name | [default to undefined]
**description** | **string** | Product description | [default to undefined]
**categoryId** | **string** | Category ID | [default to undefined]
**price** | **number** | Product price in cents | [default to undefined]
**discountPercent** | **object** | Discount percentage | [optional] [default to undefined]
**finalPrice** | **number** | Final price after discount in cents | [default to undefined]
**tryOn** | **boolean** | Whether try-on feature is enabled | [default to undefined]
**status** | **string** | Product status | [default to undefined]
**isActive** | **boolean** | Whether product is active | [default to undefined]
**hasDiscount** | **boolean** | Whether product has discount applied | [default to undefined]
**createdAt** | **string** | Product creation date | [default to undefined]
**updatedAt** | **string** | Product last update date | [default to undefined]

## Example

```typescript
import { ProductResponseDto } from './api';

const instance: ProductResponseDto = {
    id,
    name,
    description,
    categoryId,
    price,
    discountPercent,
    finalPrice,
    tryOn,
    status,
    isActive,
    hasDiscount,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
