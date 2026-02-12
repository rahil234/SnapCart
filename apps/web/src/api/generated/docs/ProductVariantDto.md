# ProductVariantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | The unique identifier of the product variant | [default to undefined]
**variantName** | **string** | The name of the product variant | [default to undefined]
**price** | **number** | The price of the product variant | [default to undefined]
**discountPercentage** | **number** | The discount percentage of the product variant | [optional] [default to undefined]
**stock** | **number** | The available stock quantity of the product variant | [default to undefined]
**imageUrl** | **string** | The URL of the product variant image | [default to undefined]

## Example

```typescript
import { ProductVariantDto } from './api';

const instance: ProductVariantDto = {
    id,
    variantName,
    price,
    discountPercentage,
    stock,
    imageUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
