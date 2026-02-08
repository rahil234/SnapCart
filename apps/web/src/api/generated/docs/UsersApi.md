# UsersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**userControllerFindAll**](#usercontrollerfindall) | **GET** /api/users | Get all users|
|[**userControllerFindOne**](#usercontrollerfindone) | **GET** /api/users/{id} | Get user by ID|
|[**userControllerGetMe**](#usercontrollergetme) | **GET** /api/users/me | Get current user profile|
|[**userControllerUpdate**](#usercontrollerupdate) | **PATCH** /api/users | Update current user|
|[**userControllerUpdateStatus**](#usercontrollerupdatestatus) | **PATCH** /api/users/{id}/status | Update user status|

# **userControllerFindAll**
> UserControllerFindAll200Response userControllerFindAll()

Retrieves all users with pagination. Admin only.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let page: number; //Page number (optional) (default to 1)
let limit: number; //Items per page (optional) (default to 10)
let search: string; //Search term (optional) (default to undefined)
let status: 'active' | 'suspended' | 'disabled'; //Filter by status (optional) (default to undefined)

const { status, data } = await apiInstance.userControllerFindAll(
    page,
    limit,
    search,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **limit** | [**number**] | Items per page | (optional) defaults to 10|
| **search** | [**string**] | Search term | (optional) defaults to undefined|
| **status** | [**&#39;active&#39; | &#39;suspended&#39; | &#39;disabled&#39;**]**Array<&#39;active&#39; &#124; &#39;suspended&#39; &#124; &#39;disabled&#39;>** | Filter by status | (optional) defaults to undefined|


### Return type

**UserControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Users retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerFindOne**
> UserControllerUpdate200Response userControllerFindOne()

Retrieves a single user by ID. Admin only.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //User CUID (default to undefined)

const { status, data } = await apiInstance.userControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | User CUID | defaults to undefined|


### Return type

**UserControllerUpdate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | User not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerGetMe**
> UserControllerGetMe200Response userControllerGetMe()

Retrieves the authenticated user profile

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.userControllerGetMe();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserControllerGetMe200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile fetched successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdate**
> UserControllerUpdate200Response userControllerUpdate(updateUserDto)

Updates the authenticated user profile

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **userControllerUpdateStatus**
> UserControllerUpdate200Response userControllerUpdateStatus(updateUserStatusDto)

Updates user account status. Admin only.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let id: string; //User CUID (default to undefined)
let updateUserStatusDto: UpdateUserStatusDto; //

const { status, data } = await apiInstance.userControllerUpdateStatus(
    id,
    updateUserStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserStatusDto** | **UpdateUserStatusDto**|  | |
| **id** | [**string**] | User CUID | defaults to undefined|


### Return type

**UserControllerUpdate200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User status updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | User not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

