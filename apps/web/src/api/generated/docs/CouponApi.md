# CouponApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**couponControllerApply**](#couponcontrollerapply) | **POST** /api/coupons/apply | |
|[**couponControllerCreate**](#couponcontrollercreate) | **POST** /api/coupons | |
|[**couponControllerFindAll**](#couponcontrollerfindall) | **GET** /api/coupons | |
|[**couponControllerFindAvailable**](#couponcontrollerfindavailable) | **GET** /api/coupons/available | |
|[**couponControllerUpdateCoupon**](#couponcontrollerupdatecoupon) | **PUT** /api/coupons/{id} | |

# **couponControllerApply**
> CouponControllerCreate200Response couponControllerApply(body)


### Example

```typescript
import {
    CouponApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponApi(configuration);

let body: object; //

const { status, data } = await apiInstance.couponControllerApply(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**CouponControllerCreate200Response**

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

# **couponControllerCreate**
> CouponControllerCreate200Response couponControllerCreate(body)


### Example

```typescript
import {
    CouponApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponApi(configuration);

let body: object; //

const { status, data } = await apiInstance.couponControllerCreate(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**CouponControllerCreate200Response**

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

# **couponControllerFindAll**
> CouponControllerFindAll200Response couponControllerFindAll()


### Example

```typescript
import {
    CouponApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponApi(configuration);

const { status, data } = await apiInstance.couponControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CouponControllerFindAll200Response**

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

# **couponControllerFindAvailable**
> CouponControllerFindAll200Response couponControllerFindAvailable()


### Example

```typescript
import {
    CouponApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponApi(configuration);

const { status, data } = await apiInstance.couponControllerFindAvailable();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CouponControllerFindAll200Response**

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

# **couponControllerUpdateCoupon**
> CouponControllerCreate200Response couponControllerUpdateCoupon(body)


### Example

```typescript
import {
    CouponApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CouponApi(configuration);

let id: string; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.couponControllerUpdateCoupon(
    id,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CouponControllerCreate200Response**

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

