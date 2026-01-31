# ProductResponsePickDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the product | [default to undefined]
**name** | **string** | Name of the product | [default to undefined]
**price** | **number** | Actual price of the product | [default to undefined]
**discountPrice** | **number** | Discounted price of the product | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage of the product | [optional] [default to undefined]
**thumbnail** | **string** | Product thumbnail URL | [optional] [default to undefined]
**category** | [**CategoryResponsePickDto**](CategoryResponsePickDto.md) | Category details of the product (optional) | [default to undefined]

## Example

```typescript
import { ProductResponsePickDto } from './api';

const instance: ProductResponsePickDto = {
    id,
    name,
    price,
    discountPrice,
    discountPercent,
    thumbnail,
    category,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
