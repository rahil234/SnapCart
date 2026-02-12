# SellerOrdersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**sellerOrderControllerGetOrderById**](#sellerordercontrollergetorderbyid) | **GET** /api/seller/orders/{id} | Get order by ID|
|[**sellerOrderControllerGetSellerOrders**](#sellerordercontrollergetsellerorders) | **GET** /api/seller/orders | Get orders containing my products|

# **sellerOrderControllerGetOrderById**
> CustomerOrderControllerGetOrderById200Response sellerOrderControllerGetOrderById()

Retrieve detailed information about a specific order (if it contains seller products)

### Example

```typescript
import {
    SellerOrdersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerOrdersApi(configuration);

let id: string; //Order ID (default to undefined)

const { status, data } = await apiInstance.sellerOrderControllerGetOrderById(
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

# **sellerOrderControllerGetSellerOrders**
> CustomerOrderControllerGetMyOrders200Response sellerOrderControllerGetSellerOrders()

Retrieve orders that contain products sold by this seller

### Example

```typescript
import {
    SellerOrdersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerOrdersApi(configuration);

let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.sellerOrderControllerGetSellerOrders(
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

