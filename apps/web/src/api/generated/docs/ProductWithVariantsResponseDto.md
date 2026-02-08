# ProductWithVariantsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Product ID | [default to undefined]
**name** | **string** | Product name | [default to undefined]
**description** | **string** | Product description | [default to undefined]
**categoryId** | **string** | Category ID | [default to undefined]
**brand** | **string** | Brand name | [optional] [default to undefined]
**status** | **string** | Product status (catalog lifecycle) | [default to undefined]
**isActive** | **boolean** | Whether product is active in catalog | [default to undefined]
**isInCatalog** | **boolean** | Whether product is in catalog (not deleted/discontinued) | [default to undefined]
**createdAt** | **string** | Product creation date | [default to undefined]
**updatedAt** | **string** | Product last update date | [default to undefined]
**category** | [**CategoryNestedDto**](CategoryNestedDto.md) | Category details | [default to undefined]
**variants** | [**Array&lt;VariantResponseDto&gt;**](VariantResponseDto.md) | Sellable variants of the product | [default to undefined]

## Example

```typescript
import { ProductWithVariantsResponseDto } from './api';

const instance: ProductWithVariantsResponseDto = {
    id,
    name,
    description,
    categoryId,
    brand,
    status,
    isActive,
    isInCatalog,
    createdAt,
    updatedAt,
    category,
    variants,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
