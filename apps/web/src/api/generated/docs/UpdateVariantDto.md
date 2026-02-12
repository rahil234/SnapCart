# UpdateVariantDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**variantName** | **string** | Variant name | [optional] [default to undefined]
**price** | **number** | Price (base price before discount) | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage (0-100, set to 0 to remove discount) | [optional] [default to undefined]
**stock** | **number** | Stock quantity | [optional] [default to undefined]
**status** | **string** | Variant status | [optional] [default to undefined]
**isActive** | **boolean** | Whether variant is active (available for purchase) | [optional] [default to undefined]
**sellerProfileId** | **object** | Seller profile ID (null to remove seller) | [optional] [default to undefined]
**attributes** | **object** | Additional attributes (e.g., weight, organic flag) | [optional] [default to undefined]

## Example

```typescript
import { UpdateVariantDto } from './api';

const instance: UpdateVariantDto = {
    variantName,
    price,
    discountPercent,
    stock,
    status,
    isActive,
    sellerProfileId,
    attributes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
