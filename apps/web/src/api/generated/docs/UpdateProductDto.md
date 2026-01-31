# UpdateProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Product name | [optional] [default to undefined]
**description** | **string** | Product description | [optional] [default to undefined]
**price** | **number** | Product price in cents | [optional] [default to undefined]
**discountPercent** | **number** | Discount percentage (0-100) | [optional] [default to undefined]
**tryOn** | **boolean** | Whether try-on feature is enabled | [optional] [default to undefined]
**status** | **string** | Product status | [optional] [default to undefined]

## Example

```typescript
import { UpdateProductDto } from './api';

const instance: UpdateProductDto = {
    name,
    description,
    price,
    discountPercent,
    tryOn,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
