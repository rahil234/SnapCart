# OrdersCustomerApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customerOrderControllerCancelOrder**](#customerordercontrollercancelorder) | **PATCH** /api/orders/{id}/cancel | Cancel order|
|[**customerOrderControllerGetMyOrders**](#customerordercontrollergetmyorders) | **GET** /api/orders/my-orders | Get my orders|
|[**customerOrderControllerGetOrderById**](#customerordercontrollergetorderbyid) | **GET** /api/orders/{id} | Get order by ID|

# **customerOrderControllerCancelOrder**
> CustomerOrderControllerGetOrderById200Response customerOrderControllerCancelOrder(cancelOrderDto)

Cancel an order if it is still cancellable

### Example

```typescript
import {
    OrdersCustomerApi,
    Configuration,
    CancelOrderDto
} from './api';

const configuration = new Configuration();
const apiInstance = new OrdersCustomerApi(configuration);

let id: string; //Order ID (default to undefined)
let cancelOrderDto: CancelOrderDto; //

const { status, data } = await apiInstance.customerOrderControllerCancelOrder(
    id,
    cancelOrderDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cancelOrderDto** | **CancelOrderDto**|  | |
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
|**200** | Order cancelled successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Order not found not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customerOrderControllerGetMyOrders**
> CustomerOrderControllerGetMyOrders200Response customerOrderControllerGetMyOrders()

Retrieve all orders for the authenticated customer

### Example

```typescript
import {
    OrdersCustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrdersCustomerApi(configuration);

let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.customerOrderControllerGetMyOrders(
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to undefined|
| **limit** | [**number**] | Items per page | (optional) defaults to undefined|


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

# **customerOrderControllerGetOrderById**
> CustomerOrderControllerGetOrderById200Response customerOrderControllerGetOrderById()

Retrieve a specific order by its ID

### Example

```typescript
import {
    OrdersCustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrdersCustomerApi(configuration);

let id: string; //Order ID (default to undefined)

const { status, data } = await apiInstance.customerOrderControllerGetOrderById(
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

