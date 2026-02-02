# UpdateProductDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Product name | [optional] [default to undefined]
**description** | **string** | Product description | [optional] [default to undefined]
**brand** | **string** | Brand name | [optional] [default to undefined]
**categoryId** | **string** | Category ID (use with caution - cannot change if discontinued) | [optional] [default to undefined]
**status** | **string** | Product status (catalog lifecycle) | [optional] [default to undefined]

## Example

```typescript
import { UpdateProductDto } from './api';

const instance: UpdateProductDto = {
    name,
    description,
    brand,
    categoryId,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
