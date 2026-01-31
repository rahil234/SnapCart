# ProductPickDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the product | [default to undefined]
**name** | **string** | Name of the product | [default to undefined]
**description** | **string** | Description of the product | [default to undefined]
**price** | **number** | Actual price of the product | [default to undefined]
**discountPrice** | **number** | Discounted price of the product | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage of the product | [optional] [default to undefined]
**thumbnail** | **string** | Product thumbnail URL | [optional] [default to undefined]
**category** | [**CategoryResponsePickDto**](CategoryResponsePickDto.md) | Category details of the product (optional) | [default to undefined]

## Example

```typescript
import { ProductPickDto } from './api';

const instance: ProductPickDto = {
    id,
    name,
    description,
    price,
    discountPrice,
    discountPercent,
    thumbnail,
    category,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
