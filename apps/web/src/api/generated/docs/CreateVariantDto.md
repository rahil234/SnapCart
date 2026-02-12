# CreateVariantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**variantName** | **string** | Variant name (e.g., size, weight, color) | [default to undefined]
**price** | **number** | Price (base price before discount) | [default to undefined]
**stock** | **number** | Stock quantity | [default to undefined]
**discountPercent** | **number** | Discount percentage (0-100) | [optional] [default to 0]
**sellerProfileId** | **string** | Seller profile ID (who sells this variant) | [optional] [default to undefined]
**attributes** | **object** | Additional attributes (e.g., weight, organic flag) | [optional] [default to undefined]

## Example

```typescript
import { CreateVariantDto } from './api';

const instance: CreateVariantDto = {
    variantName,
    price,
    stock,
    discountPercent,
    sellerProfileId,
    attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
