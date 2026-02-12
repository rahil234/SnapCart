# OfferResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Offer ID | [default to undefined]
**name** | **string** | Offer name | [default to undefined]
**type** | **string** | Discount type | [default to undefined]
**discount** | **number** | Discount value | [default to undefined]
**minPurchaseAmount** | **number** | Minimum purchase amount required | [default to undefined]
**maxDiscount** | **number** | Maximum discount amount | [optional] [default to undefined]
**priority** | **number** | Priority (higher &#x3D; more important) | [default to undefined]
**startDate** | **string** | Offer start date | [default to undefined]
**endDate** | **string** | Offer end date | [default to undefined]
**status** | **string** | Offer status | [default to undefined]
**isStackable** | **boolean** | Can be stacked with coupons | [default to undefined]
**categories** | **Array&lt;string&gt;** | Applicable category IDs | [default to undefined]
**products** | **Array&lt;string&gt;** | Applicable product IDs | [default to undefined]
**description** | **string** | Offer description | [optional] [default to undefined]
**isActive** | **boolean** | Whether offer is currently active | [default to undefined]
**createdAt** | **string** | Creation timestamp | [default to undefined]
**updatedAt** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { OfferResponseDto } from './api';

const instance: OfferResponseDto = {
    id,
    name,
    type,
    discount,
    minPurchaseAmount,
    maxDiscount,
    priority,
    startDate,
    endDate,
    status,
    isStackable,
    categories,
    products,
    description,
    isActive,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
