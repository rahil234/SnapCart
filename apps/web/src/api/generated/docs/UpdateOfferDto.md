# UpdateOfferDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Offer name | [optional] [default to undefined]
**type** | **string** | Type of discount | [optional] [default to undefined]
**discount** | **number** | Discount value | [optional] [default to undefined]
**startDate** | **string** | Start date | [optional] [default to undefined]
**endDate** | **string** | End date | [optional] [default to undefined]
**minPurchaseAmount** | **number** | Minimum purchase amount | [optional] [default to undefined]
**maxDiscount** | **number** | Maximum discount amount | [optional] [default to undefined]
**priority** | **number** | Priority | [optional] [default to undefined]
**categories** | **Array&lt;string&gt;** | Category IDs | [optional] [default to undefined]
**products** | **Array&lt;string&gt;** | Product IDs | [optional] [default to undefined]
**isStackable** | **boolean** | Stackable with coupons | [optional] [default to undefined]
**description** | **string** | Offer description | [optional] [default to undefined]

## Example

```typescript
import { UpdateOfferDto } from './api';

const instance: UpdateOfferDto = {
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
