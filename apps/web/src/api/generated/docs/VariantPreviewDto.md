# VariantPreviewDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Variant ID | [default to undefined]
**variantName** | **string** | Variant name | [default to undefined]
**price** | **number** | Base price | [default to undefined]
**discountPercent** | **number** | Discount percentage | [default to undefined]
**finalPrice** | **number** | Final price after discount | [default to undefined]
**stock** | **number** | Stock quantity | [default to undefined]
**imageUrl** | **string** | Single image URL (first image) | [optional] [default to undefined]
**availableForPurchase** | **boolean** | Whether variant is available for purchase | [default to undefined]

## Example

```typescript
import { VariantPreviewDto } from './api';

const instance: VariantPreviewDto = {
    id,
    variantName,
    price,
    discountPercent,
    finalPrice,
    stock,
    imageUrl,
    availableForPurchase,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
