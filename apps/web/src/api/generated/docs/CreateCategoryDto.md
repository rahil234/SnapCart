# CreateCategoryDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Category name | [default to undefined]
**description** | **object** | Category description | [optional] [default to undefined]
**imageUrl** | **object** | Category image URL | [optional] [default to undefined]
**parentId** | **object** | Parent category ID for subcategories | [optional] [default to undefined]

## Example

```typescript
import { CreateCategoryDto } from './api';

const instance: CreateCategoryDto = {
    name,
    description,
    imageUrl,
    parentId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
