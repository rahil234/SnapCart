# CreateOfferDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Offer name | [default to undefined]
**type** | **string** | Type of discount | [default to undefined]
**discount** | **number** | Discount value (percentage or flat amount) | [default to undefined]
**startDate** | **string** | Offer start date | [default to undefined]
**endDate** | **string** | Offer end date | [default to undefined]
**minPurchaseAmount** | **number** | Minimum purchase amount required | [default to 0]
**maxDiscount** | **number** | Maximum discount amount (for percentage offers) | [optional] [default to undefined]
**priority** | **number** | Priority (higher number &#x3D; higher priority) | [default to 0]
**categories** | **Array&lt;string&gt;** | Category IDs this offer applies to | [optional] [default to undefined]
**products** | **Array&lt;string&gt;** | Product IDs this offer applies to | [optional] [default to undefined]
**isStackable** | **boolean** | Whether offer can be combined with coupons | [default to false]
**description** | **string** | Offer description for users | [optional] [default to undefined]

## Example

```typescript
import { CreateOfferDto } from './api';

const instance: CreateOfferDto = {
    name,
    type,
    discount,
    startDate,
    endDate,
    minPurchaseAmount,
    maxDiscount,
    priority,
    categories,
    products,
    isStackable,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
