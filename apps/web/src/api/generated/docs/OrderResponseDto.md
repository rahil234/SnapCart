# OrderResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the order | [default to undefined]
**orderNumber** | **string** | Order number | [default to undefined]
**customer** | [**CustomerResponseDto**](CustomerResponseDto.md) |  | [default to undefined]
**shippingAddress** | **object** |  | [optional] [default to undefined]
**subtotal** | **number** |  | [default to undefined]
**shippingCharge** | **number** |  | [default to undefined]
**discount** | **number** |  | [default to undefined]
**total** | **number** |  | [default to undefined]
**items** | [**Array&lt;OrderItemResponseDto&gt;**](OrderItemResponseDto.md) |  | [default to undefined]
**paymentMethod** | **object** |  | [optional] [default to undefined]
**paymentStatus** | **string** |  | [default to undefined]
**orderStatus** | **string** |  | [default to undefined]
**isDeleted** | **boolean** |  | [default to undefined]
**placedAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**deliveredAt** | **string** |  | [default to undefined]
**cancelledAt** | **string** |  | [default to undefined]

## Example

```typescript
import { OrderResponseDto } from './api';

const instance: OrderResponseDto = {
    id,
    orderNumber,
    customer,
    shippingAddress,
    subtotal,
    shippingCharge,
    discount,
    total,
    items,
    paymentMethod,
    paymentStatus,
    orderStatus,
    isDeleted,
    placedAt,
    updatedAt,
    deliveredAt,
    cancelledAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
