# UpdateCategoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Category name | [optional] [default to undefined]
**status** | **string** | Category status (e.g., active, inactive) | [optional] [default to undefined]
**imageUrl** | **object** | Category image URL | [optional] [default to undefined]
**parentId** | **object** | Parent category ID for subcategories | [optional] [default to undefined]

## Example

```typescript
import { UpdateCategoryDto } from './api';

const instance: UpdateCategoryDto = {
    name,
    status,
    imageUrl,
    parentId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
