# OrderApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**orderControllerCancelOrder**](#ordercontrollercancelorder) | **PATCH** /api/order/{id}/cancel | |
|[**orderControllerFindAll**](#ordercontrollerfindall) | **GET** /api/order/admin | |
|[**orderControllerFindAllByUser**](#ordercontrollerfindallbyuser) | **GET** /api/order | |
|[**orderControllerFindOne**](#ordercontrollerfindone) | **GET** /api/order/{id} | |
|[**orderControllerRefundPayment**](#ordercontrollerrefundpayment) | **PATCH** /api/order/{id}/refund | |
|[**orderControllerRequestReturn**](#ordercontrollerrequestreturn) | **PATCH** /api/order/{id}/return | |
|[**orderControllerUpdate**](#ordercontrollerupdate) | **PATCH** /api/order/{id}/status | |

# **orderControllerCancelOrder**
> OrderControllerFindOne200Response orderControllerCancelOrder(cancelOrderRequestDto)


### Example

```typescript
import {
    OrderApi,
    Configuration,
    CancelOrderRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; // (default to undefined)
let cancelOrderRequestDto: CancelOrderRequestDto; //

const { status, data } = await apiInstance.orderControllerCancelOrder(
    id,
    cancelOrderRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cancelOrderRequestDto** | **CancelOrderRequestDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OrderControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindAll**
> OrderControllerFindAllByUser200Response orderControllerFindAll()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let orderStatus: string; // (optional) (default to undefined)
let paymentStatus: string; // (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.orderControllerFindAll(
    page,
    limit,
    search,
    orderStatus,
    paymentStatus,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **orderStatus** | [**string**] |  | (optional) defaults to undefined|
| **paymentStatus** | [**string**] |  | (optional) defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**OrderControllerFindAllByUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindAllByUser**
> OrderControllerFindAllByUser200Response orderControllerFindAllByUser()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let orderStatus: string; // (optional) (default to undefined)
let paymentStatus: string; // (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.orderControllerFindAllByUser(
    page,
    limit,
    search,
    orderStatus,
    paymentStatus,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **orderStatus** | [**string**] |  | (optional) defaults to undefined|
| **paymentStatus** | [**string**] |  | (optional) defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|


### Return type

**OrderControllerFindAllByUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerFindOne**
> OrderControllerFindOne200Response orderControllerFindOne()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.orderControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OrderControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerRefundPayment**
> OrderControllerFindOne200Response orderControllerRefundPayment()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.orderControllerRefundPayment(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OrderControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerRequestReturn**
> OrderControllerFindOne200Response orderControllerRequestReturn(returnOrderRequestDto)


### Example

```typescript
import {
    OrderApi,
    Configuration,
    ReturnOrderRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; // (default to undefined)
let returnOrderRequestDto: ReturnOrderRequestDto; //

const { status, data } = await apiInstance.orderControllerRequestReturn(
    id,
    returnOrderRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **returnOrderRequestDto** | **ReturnOrderRequestDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OrderControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **orderControllerUpdate**
> OrderControllerFindOne200Response orderControllerUpdate(updateOrderDto)


### Example

```typescript
import {
    OrderApi,
    Configuration,
    UpdateOrderDto
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let id: string; // (default to undefined)
let updateOrderDto: UpdateOrderDto; //

const { status, data } = await apiInstance.orderControllerUpdate(
    id,
    updateOrderDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrderDto** | **UpdateOrderDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**OrderControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

