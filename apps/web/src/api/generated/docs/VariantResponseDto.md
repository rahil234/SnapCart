# VariantResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Variant ID | [default to undefined]
**productId** | **string** | Product ID | [default to undefined]
**sku** | **string** | SKU (Stock Keeping Unit) | [default to undefined]
**variantName** | **string** | Variant name | [default to undefined]
**price** | **number** | Base price | [default to undefined]
**discountPercent** | **number** | Discount percentage | [default to undefined]
**finalPrice** | **number** | Final price after discount | [default to undefined]
**stock** | **number** | Stock quantity | [default to undefined]
**status** | **string** | Variant status | [default to undefined]
**isActive** | **boolean** | Whether variant is active | [default to undefined]
**inStock** | **boolean** | Whether variant is in stock | [default to undefined]
**availableForPurchase** | **boolean** | Whether variant is available for purchase | [default to undefined]
**sellerProfileId** | **object** | Seller profile ID | [optional] [default to undefined]
**attributes** | **object** | Additional attributes | [optional] [default to undefined]
**imageUrl** | **object** | Image URL | [optional] [default to undefined]
**createdAt** | **string** | Creation date | [default to undefined]
**updatedAt** | **string** | Last update date | [default to undefined]

## Example

```typescript
import { VariantResponseDto } from './api';

const instance: VariantResponseDto = {
    id,
    productId,
    sku,
    variantName,
    price,
    discountPercent,
    finalPrice,
    stock,
    status,
    isActive,
    inStock,
    availableForPurchase,
    sellerProfileId,
    attributes,
    imageUrl,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
