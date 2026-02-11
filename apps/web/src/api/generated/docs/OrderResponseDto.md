# OrderResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Order ID | [default to undefined]
**orderNumber** | **string** | Order number | [default to undefined]
**customerId** | **string** | Customer ID | [default to undefined]
**customer** | [**CustomerInfoResponseDto**](CustomerInfoResponseDto.md) | Customer information | [optional] [default to undefined]
**items** | [**Array&lt;OrderItemResponseDto&gt;**](OrderItemResponseDto.md) | Order items | [default to undefined]
**subtotal** | **number** | Subtotal amount | [default to undefined]
**discount** | **number** | Discount amount | [default to undefined]
**couponDiscount** | **number** | Coupon discount amount | [default to undefined]
**offerDiscount** | **number** | Offer discount amount | [default to undefined]
**shippingCharge** | **number** | Shipping charge | [default to undefined]
**tax** | **number** | Tax amount | [default to undefined]
**total** | **number** | Total amount | [default to undefined]
**appliedCouponCode** | **string** | Applied coupon code | [default to undefined]
**appliedOfferIds** | **Array&lt;string&gt;** | Applied offer IDs | [default to undefined]
**shippingAddress** | **object** | Shipping address JSON | [default to undefined]
**paymentMethod** | **string** | Payment method | [default to undefined]
**paymentStatus** | **string** | Payment status | [default to undefined]
**orderStatus** | **string** | Order status | [default to undefined]
**metadata** | **object** | Order metadata | [default to undefined]
**cancelReason** | **string** | Cancel reason | [default to undefined]
**refundAmount** | **number** | Refund amount | [default to undefined]
**placedAt** | **string** | Order placed date | [default to undefined]
**deliveredAt** | **string** | Delivered date | [default to undefined]
**cancelledAt** | **string** | Cancelled date | [default to undefined]
**updatedAt** | **string** | Last updated date | [default to undefined]

## Example

```typescript
import { OrderResponseDto } from './api';

const instance: OrderResponseDto = {
    id,
    orderNumber,
    customerId,
    customer,
    items,
    subtotal,
    discount,
    couponDiscount,
    offerDiscount,
    shippingCharge,
    tax,
    total,
    appliedCouponCode,
    appliedOfferIds,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    orderStatus,
    metadata,
    cancelReason,
    refundAmount,
    placedAt,
    deliveredAt,
    cancelledAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
