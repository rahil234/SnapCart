# PaginatedProductsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**data** | [**Array&lt;ProductResponseDto&gt;**](ProductResponseDto.md) | Array of products | [default to undefined]
**total** | **number** | Total number of products | [default to undefined]
**page** | **number** | Current page number | [default to undefined]
**limit** | **number** | Number of items per page | [default to undefined]
**totalPages** | **number** | Total number of pages | [default to undefined]
**hasNext** | **boolean** | Whether there is a next page | [default to undefined]
**hasPrev** | **boolean** | Whether there is a previous page | [default to undefined]

## Example

```typescript
import { PaginatedProductsResponseDto } from './api';

const instance: PaginatedProductsResponseDto = {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
