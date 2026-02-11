# AdminCouponsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminCouponControllerActivate**](#admincouponcontrolleractivate) | **PATCH** /api/admin/coupons/{id}/activate | Activate coupon|
|[**adminCouponControllerCreate**](#admincouponcontrollercreate) | **POST** /api/admin/coupons | Create new coupon|
|[**adminCouponControllerDeactivate**](#admincouponcontrollerdeactivate) | **PATCH** /api/admin/coupons/{id}/deactivate | Deactivate coupon|
|[**adminCouponControllerFindAll**](#admincouponcontrollerfindall) | **GET** /api/admin/coupons | Get all coupons|
|[**adminCouponControllerFindOne**](#admincouponcontrollerfindone) | **GET** /api/admin/coupons/{id} | Get coupon by ID|
|[**adminCouponControllerGetCouponAnalytics**](#admincouponcontrollergetcouponanalytics) | **GET** /api/admin/coupons/analytics/performance | Get coupon performance analytics|
|[**adminCouponControllerGetUsageHistory**](#admincouponcontrollergetusagehistory) | **GET** /api/admin/coupons/{id}/usage | Get coupon usage history|
|[**adminCouponControllerUpdate**](#admincouponcontrollerupdate) | **PATCH** /api/admin/coupons/{id} | Update coupon|

# **adminCouponControllerActivate**
> MessageOnlyResponse adminCouponControllerActivate()

Activate a coupon to make it available for use

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let id: string; //Coupon ID (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerActivate(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Coupon ID | defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon activated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerCreate**
> CouponControllerGetCouponByCode200Response adminCouponControllerCreate(createCouponDto)

Create a new discount coupon with usage limits and validation rules

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration,
    CreateCouponDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let createCouponDto: CreateCouponDto; //

const { status, data } = await apiInstance.adminCouponControllerCreate(
    createCouponDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCouponDto** | **CreateCouponDto**|  | |


### Return type

**CouponControllerGetCouponByCode200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Coupon created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerDeactivate**
> MessageOnlyResponse adminCouponControllerDeactivate()

Deactivate a coupon to prevent further use

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let id: string; //Coupon ID (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerDeactivate(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Coupon ID | defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon deactivated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerFindAll**
> CouponControllerGetAvailableCoupons200Response adminCouponControllerFindAll()

Retrieve all coupons with pagination

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let page: number; //Page number (optional) (default to undefined)
let limit: number; //Items per page (optional) (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerFindAll(
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

**CouponControllerGetAvailableCoupons200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupons retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerFindOne**
> CouponControllerGetCouponByCode200Response adminCouponControllerFindOne()

Retrieve detailed information about a specific coupon

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let id: string; //Coupon ID (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Coupon ID | defaults to undefined|


### Return type

**CouponControllerGetCouponByCode200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerGetCouponAnalytics**
> MessageOnlyResponse adminCouponControllerGetCouponAnalytics()

Retrieve analytics and performance metrics for all coupons including usage stats, revenue impact, and top performers

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let startDate: string; //Start date for analytics period (ISO format) (optional) (default to undefined)
let endDate: string; //End date for analytics period (ISO format) (optional) (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerGetCouponAnalytics(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | Start date for analytics period (ISO format) | (optional) defaults to undefined|
| **endDate** | [**string**] | End date for analytics period (ISO format) | (optional) defaults to undefined|


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Analytics retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerGetUsageHistory**
> AdminCouponControllerGetUsageHistory200Response adminCouponControllerGetUsageHistory()

Retrieve detailed usage history for a specific coupon

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let id: string; //Coupon ID (default to undefined)

const { status, data } = await apiInstance.adminCouponControllerGetUsageHistory(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Coupon ID | defaults to undefined|


### Return type

**AdminCouponControllerGetUsageHistory200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon usage history retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminCouponControllerUpdate**
> CouponControllerGetCouponByCode200Response adminCouponControllerUpdate(updateCouponDto)

Update coupon details and configuration

### Example

```typescript
import {
    AdminCouponsApi,
    Configuration,
    UpdateCouponDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminCouponsApi(configuration);

let id: string; //Coupon ID (default to undefined)
let updateCouponDto: UpdateCouponDto; //

const { status, data } = await apiInstance.adminCouponControllerUpdate(
    id,
    updateCouponDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCouponDto** | **UpdateCouponDto**|  | |
| **id** | [**string**] | Coupon ID | defaults to undefined|


### Return type

**CouponControllerGetCouponByCode200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Coupon updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Coupon not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

