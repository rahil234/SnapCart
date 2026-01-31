# CartResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the cart | [default to undefined]
**count** | **number** | Total number of items in the cart | [default to undefined]
**items** | [**Array&lt;CartItemResponseDto&gt;**](CartItemResponseDto.md) | List of items in the cart | [default to undefined]

## Example

```typescript
import { CartResponseDto } from './api';

const instance: CartResponseDto = {
    id,
    count,
    items,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
