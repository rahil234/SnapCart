# SalesReportItemDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**date** | **object** | Date or period identifier | [default to undefined]
**startDate** | **object** | Start date of the period | [default to undefined]
**endDate** | **object** | End date of the period | [default to undefined]
**totalOrders** | **number** | Total number of orders | [default to undefined]
**totalSales** | **number** | Total sales amount | [default to undefined]
**totalDiscountApplied** | **number** | Total discount applied | [default to undefined]
**netSales** | **number** | Net sales after discounts | [default to undefined]
**totalItemsSold** | **number** | Total items sold | [default to undefined]

## Example

```typescript
import { SalesReportItemDto } from './api';

const instance: SalesReportItemDto = {
    date,
    startDate,
    endDate,
    totalOrders,
    totalSales,
    totalDiscountApplied,
    netSales,
    totalItemsSold,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
