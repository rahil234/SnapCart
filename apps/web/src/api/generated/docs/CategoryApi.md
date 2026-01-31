# CategoryApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**categoryControllerCreate**](#categorycontrollercreate) | **POST** /api/category | |
|[**categoryControllerFindAll**](#categorycontrollerfindall) | **GET** /api/category/all | |
|[**categoryControllerFindAllActive**](#categorycontrollerfindallactive) | **GET** /api/category | |
|[**categoryControllerFindOne**](#categorycontrollerfindone) | **GET** /api/category/{id} | |
|[**categoryControllerUpdate**](#categorycontrollerupdate) | **PATCH** /api/category/{id} | |

# **categoryControllerCreate**
> CategoryControllerFindAllActive200Response categoryControllerCreate(createCategoryDto)


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    CreateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let createCategoryDto: CreateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerCreate(
    createCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCategoryDto** | **CreateCategoryDto**|  | |


### Return type

**CategoryControllerFindAllActive200Response**

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

# **categoryControllerFindAll**
> CategoryControllerFindAll200Response categoryControllerFindAll()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let status: 'active' | 'inactive'; // (optional) (default to undefined)

const { status, data } = await apiInstance.categoryControllerFindAll(
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
| **status** | [**&#39;active&#39; | &#39;inactive&#39;**]**Array<&#39;active&#39; &#124; &#39;inactive&#39;>** |  | (optional) defaults to undefined|


### Return type

**CategoryControllerFindAll200Response**

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

# **categoryControllerFindAllActive**
> CategoryControllerFindAllActive200Response categoryControllerFindAllActive()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

const { status, data } = await apiInstance.categoryControllerFindAllActive();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**CategoryControllerFindAllActive200Response**

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

# **categoryControllerFindOne**
> CategoryControllerFindAllActive200Response categoryControllerFindOne()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.categoryControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CategoryControllerFindAllActive200Response**

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

# **categoryControllerUpdate**
> CategoryControllerFindAllActive200Response categoryControllerUpdate(updateCategoryDto)


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    UpdateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: string; // (default to undefined)
let updateCategoryDto: UpdateCategoryDto; //

const { status, data } = await apiInstance.categoryControllerUpdate(
    id,
    updateCategoryDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCategoryDto** | **UpdateCategoryDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**CategoryControllerFindAllActive200Response**

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

