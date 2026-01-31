# CreateProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Product name | [default to undefined]
**description** | **string** | Product description | [default to undefined]
**categoryId** | **string** | Category ID | [default to undefined]
**price** | **number** | Product price in cents | [default to undefined]
**discountPercent** | **number** | Discount percentage (0-100) | [optional] [default to undefined]
**tryOn** | **boolean** | Whether try-on feature is enabled | [optional] [default to false]

## Example

```typescript
import { CreateProductDto } from './api';

const instance: CreateProductDto = {
    name,
    description,
    categoryId,
    price,
    discountPercent,
    tryOn,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
