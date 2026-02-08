# ProductWithVariantPreviewDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Product ID | [default to undefined]
**name** | **string** | Product name | [default to undefined]
**brand** | **string** | Brand name | [optional] [default to undefined]
**category** | [**CategoryNestedDto**](CategoryNestedDto.md) | Category details | [default to undefined]
**variant** | [**VariantPreviewDto**](VariantPreviewDto.md) | Featured/first variant for quick preview | [default to undefined]

## Example

```typescript
import { ProductWithVariantPreviewDto } from './api';

const instance: ProductWithVariantPreviewDto = {
    id,
    name,
    brand,
    category,
    variant,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
