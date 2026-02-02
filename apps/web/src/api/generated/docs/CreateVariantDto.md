# CreateVariantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sku** | **string** | SKU (Stock Keeping Unit) - must be unique across all variants | [default to undefined]
**variantName** | **string** | Variant name (e.g., size, weight, color) | [default to undefined]
**price** | **number** | Price (base price before discount) | [default to undefined]
**stock** | **number** | Stock quantity | [default to undefined]
**discountPercent** | **number** | Discount percentage (0-100) | [optional] [default to 0]
**sellerProfileId** | **string** | Seller profile ID (who sells this variant) | [optional] [default to undefined]
**imageUrl** | **string** | Image URL for this specific variant | [optional] [default to undefined]

## Example

```typescript
import { CreateVariantDto } from './api';

const instance: CreateVariantDto = {
    sku,
    variantName,
    price,
    stock,
    discountPercent,
    sellerProfileId,
    imageUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
