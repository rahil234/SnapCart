# SellerApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**sellerControllerAddSeller**](#sellercontrolleraddseller) | **POST** /api/seller | |
|[**sellerControllerAllowSeller**](#sellercontrollerallowseller) | **POST** /api/seller/{id}/allow | |
|[**sellerControllerBlockSeller**](#sellercontrollerblockseller) | **POST** /api/seller/{id}/block | |
|[**sellerControllerGetMe**](#sellercontrollergetme) | **GET** /api/seller/me | |
|[**sellerControllerGetSellers**](#sellercontrollergetsellers) | **GET** /api/seller | |

# **sellerControllerAddSeller**
> SellerControllerAddSeller200Response sellerControllerAddSeller(body)


### Example

```typescript
import {
    SellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerApi(configuration);

let body: object; //

const { status, data } = await apiInstance.sellerControllerAddSeller(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

**SellerControllerAddSeller200Response**

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

# **sellerControllerAllowSeller**
> SellerControllerBlockSeller200Response sellerControllerAllowSeller()


### Example

```typescript
import {
    SellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.sellerControllerAllowSeller(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SellerControllerBlockSeller200Response**

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

# **sellerControllerBlockSeller**
> SellerControllerBlockSeller200Response sellerControllerBlockSeller()


### Example

```typescript
import {
    SellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.sellerControllerBlockSeller(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SellerControllerBlockSeller200Response**

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

# **sellerControllerGetMe**
> AdminControllerGetMe200Response sellerControllerGetMe()


### Example

```typescript
import {
    SellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerApi(configuration);

const { status, data } = await apiInstance.sellerControllerGetMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**AdminControllerGetMe200Response**

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

# **sellerControllerGetSellers**
> SellerControllerGetSellers200Response sellerControllerGetSellers()


### Example

```typescript
import {
    SellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SellerApi(configuration);

const { status, data } = await apiInstance.sellerControllerGetSellers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**SellerControllerGetSellers200Response**

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

