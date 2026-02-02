# PaginationMetaDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**page** | **number** | Current page number | [default to undefined]
**limit** | **number** | Number of items per page | [default to undefined]
**total** | **number** | Total number of items | [default to undefined]
**hasNextPage** | **boolean** | Whether there is a next page | [default to undefined]
**hasPrevPage** | **boolean** | Whether there is a previous page | [default to undefined]

## Example

```typescript
import { PaginationMetaDto } from './api';

const instance: PaginationMetaDto = {
    page,
    limit,
    total,
    hasNextPage,
    hasPrevPage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
