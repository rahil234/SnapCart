# AdminOrdersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminOrderControllerGetAllOrders**](#adminordercontrollergetallorders) | **GET** /api/admin/orders | Get all orders|
|[**adminOrderControllerGetOrderById**](#adminordercontrollergetorderbyid) | **GET** /api/admin/orders/{id} | Get order by ID|
|[**adminOrderControllerUpdateOrderStatus**](#adminordercontrollerupdateorderstatus) | **PATCH** /api/admin/orders/{id}/status | Update order status|

# **adminOrderControllerGetAllOrders**
> CustomerOrderControllerGetMyOrders200Response adminOrderControllerGetAllOrders()

Retrieve all orders with optional filtering

### Example

```typescript
import {
    AdminOrdersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOrdersApi(configuration);

let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)
let status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'canceled' | 'return_requested' | 'return_approved' | 'return_rejected' | 'returned'; //Filter by order status (optional) (default to undefined)
let customerId: string; //Filter by customer ID (optional) (default to undefined)
let startDate: string; //Filter from date (ISO string) (optional) (default to undefined)
let endDate: string; //Filter to date (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.adminOrderControllerGetAllOrders(
    page,
    limit,
    status,
    customerId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|
| **status** | [**&#39;pending&#39; | &#39;processing&#39; | &#39;shipping&#39; | &#39;delivered&#39; | &#39;canceled&#39; | &#39;return_requested&#39; | &#39;return_approved&#39; | &#39;return_rejected&#39; | &#39;returned&#39;**]**Array<&#39;pending&#39; &#124; &#39;processing&#39; &#124; &#39;shipping&#39; &#124; &#39;delivered&#39; &#124; &#39;canceled&#39; &#124; &#39;return_requested&#39; &#124; &#39;return_approved&#39; &#124; &#39;return_rejected&#39; &#124; &#39;returned&#39;>** | Filter by order status | (optional) defaults to undefined|
| **customerId** | [**string**] | Filter by customer ID | (optional) defaults to undefined|
| **startDate** | [**string**] | Filter from date (ISO string) | (optional) defaults to undefined|
| **endDate** | [**string**] | Filter to date (ISO string) | (optional) defaults to undefined|


### Return type

**CustomerOrderControllerGetMyOrders200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Orders retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOrderControllerGetOrderById**
> CustomerOrderControllerGetOrderById200Response adminOrderControllerGetOrderById()

Retrieve detailed information about a specific order

### Example

```typescript
import {
    AdminOrdersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOrdersApi(configuration);

let id: string; //Order ID (default to undefined)

const { status, data } = await apiInstance.adminOrderControllerGetOrderById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Order ID | defaults to undefined|


### Return type

**CustomerOrderControllerGetOrderById200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Order retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Order not found not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminOrderControllerUpdateOrderStatus**
> CustomerOrderControllerGetOrderById200Response adminOrderControllerUpdateOrderStatus(updateOrderStatusDto)

Update the status of an order

### Example

```typescript
import {
    AdminOrdersApi,
    Configuration,
    UpdateOrderStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOrdersApi(configuration);

let id: string; //Order ID (default to undefined)
let updateOrderStatusDto: UpdateOrderStatusDto; //

const { status, data } = await apiInstance.adminOrderControllerUpdateOrderStatus(
    id,
    updateOrderStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderStatusDto** | **UpdateOrderStatusDto**|  | |
| **id** | [**string**] | Order ID | defaults to undefined|


### Return type

**CustomerOrderControllerGetOrderById200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Order status updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Order not found not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

