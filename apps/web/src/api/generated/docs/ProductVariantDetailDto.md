# ProductVariantDetailDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Product variant ID | [default to undefined]
**variantName** | **string** | Variant name (e.g., \&quot;500g\&quot;, \&quot;1kg\&quot;, \&quot;Red-M\&quot;) | [default to undefined]
**price** | **number** | Price of the variant | [default to undefined]
**discountPercent** | **number** | Discount percentage | [default to undefined]
**finalPrice** | **number** | Final price after discount | [default to undefined]
**stock** | **number** | Stock available | [default to undefined]
**status** | **string** | Variant status | [default to undefined]
**productId** | **string** | Product ID | [default to undefined]
**productName** | **string** | Product name | [default to undefined]
**productDescription** | **string** | Product description | [default to undefined]
**productBrand** | **object** | Product brand | [default to undefined]
**imageUrl** | **string** | Variant image URL | [default to undefined]

## Example

```typescript
import { ProductVariantDetailDto } from './api';

const instance: ProductVariantDetailDto = {
    id,
    variantName,
    price,
    discountPercent,
    finalPrice,
    stock,
    status,
    productId,
    productName,
    productDescription,
    productBrand,
    imageUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
