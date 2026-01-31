# DashboardAnalyticsResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalRevenue** | **number** | Total revenue generated | [default to undefined]
**totalOrders** | **number** | Total number of orders | [default to undefined]
**totalProducts** | **number** | Total number of products | [default to undefined]
**totalCustomers** | **number** | Total number of customers | [default to undefined]
**salesOverview** | [**Array&lt;SalesOverviewItemDto&gt;**](SalesOverviewItemDto.md) |  | [default to undefined]
**topSellingProducts** | [**Array&lt;TopSellingProductDto&gt;**](TopSellingProductDto.md) |  | [default to undefined]
**recentOrders** | [**Array&lt;RecentOrderDto&gt;**](RecentOrderDto.md) |  | [default to undefined]

## Example

```typescript
import { DashboardAnalyticsResponseDto } from './api';

const instance: DashboardAnalyticsResponseDto = {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    salesOverview,
    topSellingProducts,
    recentOrders,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
