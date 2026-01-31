# RecentOrderDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**orderId** | **string** | Unique identifier for the order | [default to undefined]
**customerName** | **string** | Name of the customer who placed the order | [default to undefined]
**total** | **number** | Total amount for the order | [default to undefined]
**date** | **string** | Date when the order was placed | [default to undefined]
**status** | **string** | Current status of the order | [default to undefined]

## Example

```typescript
import { RecentOrderDto } from './api';

const instance: RecentOrderDto = {
    orderId,
    customerName,
    total,
    date,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
