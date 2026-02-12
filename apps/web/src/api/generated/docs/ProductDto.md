# ProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The unique identifier of the product | [default to undefined]
**name** | **string** | The name of the product | [default to undefined]
**category** | [**CategoryResponseDto**](CategoryResponseDto.md) | The category of the product | [default to undefined]
**variant** | [**ProductVariantDto**](ProductVariantDto.md) | The variant of the product | [default to undefined]

## Example

```typescript
import { ProductDto } from './api';

const instance: ProductDto = {
    id,
    name,
    category,
    variant,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
