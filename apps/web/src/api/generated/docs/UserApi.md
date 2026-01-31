# UserApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerCreateAddress**](#usercontrollercreateaddress) | **POST** /api/user/address | |
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /api/user/{id} | |
|[**userControllerGetUsers**](#usercontrollergetusers) | **GET** /api/user | |
|[**userControllerMe**](#usercontrollerme) | **GET** /api/user/me | |
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /api/user | |
|[**userControllerUpdateAddress**](#usercontrollerupdateaddress) | **PATCH** /api/user/address/{id} | |
|[**userControllerUpdateStatus**](#usercontrollerupdatestatus) | **PATCH** /api/user/{id}/status | |

# **userControllerCreateAddress**
> UserControllerCreateAddress200Response userControllerCreateAddress(createAddressDto)


### Example

```typescript
import {
    UserApi,
    Configuration,
    CreateAddressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let createAddressDto: CreateAddressDto; //

const { status, data } = await apiInstance.userControllerCreateAddress(
    createAddressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createAddressDto** | **CreateAddressDto**|  | |


### Return type

**UserControllerCreateAddress200Response**

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

# **userControllerFindOne**
> UserControllerUpdate200Response userControllerFindOne()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.userControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**UserControllerUpdate200Response**

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

# **userControllerGetUsers**
> UserControllerGetUsers200Response userControllerGetUsers()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let status: 'active' | 'suspended'; // (optional) (default to undefined)

const { status, data } = await apiInstance.userControllerGetUsers(
    page,
    limit,
    search,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **status** | [**&#39;active&#39; | &#39;suspended&#39;**]**Array<&#39;active&#39; &#124; &#39;suspended&#39;>** |  | (optional) defaults to undefined|


### Return type

**UserControllerGetUsers200Response**

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

# **userControllerMe**
> UserControllerUpdate200Response userControllerMe()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.userControllerMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserControllerUpdate200Response**

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

# **userControllerUpdate**
> UserControllerUpdate200Response userControllerUpdate(updateUserDto)


### Example

```typescript
import {
    UserApi,
    Configuration,
    UpdateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let updateUserDto: UpdateUserDto; //

const { status, data } = await apiInstance.userControllerUpdate(
    updateUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |


### Return type

**UserControllerUpdate200Response**

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

# **userControllerUpdateAddress**
> UserControllerUpdate200Response userControllerUpdateAddress(updateAddressDto)


### Example

```typescript
import {
    UserApi,
    Configuration,
    UpdateAddressDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)
let updateAddressDto: UpdateAddressDto; //

const { status, data } = await apiInstance.userControllerUpdateAddress(
    id,
    updateAddressDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateAddressDto** | **UpdateAddressDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**UserControllerUpdate200Response**

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

# **userControllerUpdateStatus**
> UserControllerUpdate200Response userControllerUpdateStatus(body)


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)
let body: object; //

const { status, data } = await apiInstance.userControllerUpdateStatus(
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

**UserControllerUpdate200Response**

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

