# CategoriesApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**categoryControllerCreate**](#categorycontrollercreate) | **POST** /api/categories | Create a new category|
|[**categoryControllerFindAll**](#categorycontrollerfindall) | **GET** /api/categories | Get all categories|
|[**categoryControllerFindOne**](#categorycontrollerfindone) | **GET** /api/categories/{id} | Get category by ID|
|[**categoryControllerRemove**](#categorycontrollerremove) | **DELETE** /api/categories/{id} | Delete category|
|[**categoryControllerUpdate**](#categorycontrollerupdate) | **PATCH** /api/categories/{id} | Update category|

# **categoryControllerCreate**
> categoryControllerCreate(createCategoryDto)

Creates a new category with the provided details. Only admins can create categories.

### Example

```typescript
import {
    CategoriesApi,
    Configuration,
    CreateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Category created successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Authentication required |  -  |
|**403** | Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerFindAll**
> Array<CategoryResponseDto> categoryControllerFindAll()

Retrieves all categories

### Example

```typescript
import {
    CategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

const { status, data } = await apiInstance.categoryControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<CategoryResponseDto>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Categories retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerFindOne**
> CategoryResponseDto categoryControllerFindOne()

Retrieves a single category by its ID

### Example

```typescript
import {
    CategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

let id: string; //Category ID (default to undefined)

const { status, data } = await apiInstance.categoryControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Category ID | defaults to undefined|


### Return type

**CategoryResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Category retrieved successfully |  -  |
|**404** | Category not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerRemove**
> categoryControllerRemove()

Deletes a category. Only admins can delete categories.

### Example

```typescript
import {
    CategoriesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

let id: string; //Category ID (default to undefined)

const { status, data } = await apiInstance.categoryControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Category ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Category deleted successfully |  -  |
|**401** | Authentication required |  -  |
|**403** | Admin access required |  -  |
|**404** | Category not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **categoryControllerUpdate**
> categoryControllerUpdate(updateCategoryDto)

Updates an existing category. Only admins can update categories.

### Example

```typescript
import {
    CategoriesApi,
    Configuration,
    UpdateCategoryDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoriesApi(configuration);

let id: string; //Category ID (default to undefined)
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
| **id** | [**string**] | Category ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Category updated successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Authentication required |  -  |
|**403** | Admin access required |  -  |
|**404** | Category not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

