# AdminBannersApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminBannerControllerCreate**](#adminbannercontrollercreate) | **POST** /api/admin/banners | Create a new banner|
|[**adminBannerControllerDelete**](#adminbannercontrollerdelete) | **DELETE** /api/admin/banners/{id} | Delete a banner|
|[**adminBannerControllerFindAll**](#adminbannercontrollerfindall) | **GET** /api/admin/banners | Get all banners|
|[**adminBannerControllerFindOne**](#adminbannercontrollerfindone) | **GET** /api/admin/banners/{id} | Get banner by ID|
|[**adminBannerControllerGenerateUploadUrl**](#adminbannercontrollergenerateuploadurl) | **POST** /api/admin/banners/generate-upload-url | Generate presigned upload URL|
|[**adminBannerControllerReorder**](#adminbannercontrollerreorder) | **POST** /api/admin/banners/reorder | Reorder banners|
|[**adminBannerControllerUpdate**](#adminbannercontrollerupdate) | **PATCH** /api/admin/banners/{id} | Update a banner|

# **adminBannerControllerCreate**
> AdminBannerControllerCreate201Response adminBannerControllerCreate(createBannerDto)

Create a new banner for the homepage

### Example

```typescript
import {
    AdminBannersApi,
    Configuration,
    CreateBannerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let createBannerDto: CreateBannerDto; //

const { status, data } = await apiInstance.adminBannerControllerCreate(
    createBannerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createBannerDto** | **CreateBannerDto**|  | |


### Return type

**AdminBannerControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Banner created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerDelete**
> MessageOnlyResponse adminBannerControllerDelete()

Permanently delete a banner

### Example

```typescript
import {
    AdminBannersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let id: string; //Banner ID (default to undefined)

const { status, data } = await apiInstance.adminBannerControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Banner ID | defaults to undefined|


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
|**200** | Banner deleted successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Resource not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerFindAll**
> BannerControllerFindAll200Response adminBannerControllerFindAll()

Retrieve all banners (including inactive) for admin management

### Example

```typescript
import {
    AdminBannersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

const { status, data } = await apiInstance.adminBannerControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**BannerControllerFindAll200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Banners retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerFindOne**
> AdminBannerControllerCreate201Response adminBannerControllerFindOne()

Retrieve a specific banner by its ID

### Example

```typescript
import {
    AdminBannersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let id: string; //Banner ID (default to undefined)

const { status, data } = await apiInstance.adminBannerControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Banner ID | defaults to undefined|


### Return type

**AdminBannerControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Banner retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Resource not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerGenerateUploadUrl**
> AdminBannerControllerGenerateUploadUrl201Response adminBannerControllerGenerateUploadUrl(generateBannerUploadUrlDto)

Generate a presigned URL for client-side banner image upload to Cloudinary

### Example

```typescript
import {
    AdminBannersApi,
    Configuration,
    GenerateBannerUploadUrlDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let generateBannerUploadUrlDto: GenerateBannerUploadUrlDto; //

const { status, data } = await apiInstance.adminBannerControllerGenerateUploadUrl(
    generateBannerUploadUrlDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **generateBannerUploadUrlDto** | **GenerateBannerUploadUrlDto**|  | |


### Return type

**AdminBannerControllerGenerateUploadUrl201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Upload URL generated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerReorder**
> MessageOnlyResponse adminBannerControllerReorder(reorderBannersDto)

Update the display order of multiple banners at once (for drag and drop)

### Example

```typescript
import {
    AdminBannersApi,
    Configuration,
    ReorderBannersDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let reorderBannersDto: ReorderBannersDto; //

const { status, data } = await apiInstance.adminBannerControllerReorder(
    reorderBannersDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reorderBannersDto** | **ReorderBannersDto**|  | |


### Return type

**MessageOnlyResponse**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Banners reordered successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminBannerControllerUpdate**
> AdminBannerControllerCreate201Response adminBannerControllerUpdate(updateBannerDto)

Update an existing banner (image URL or active status)

### Example

```typescript
import {
    AdminBannersApi,
    Configuration,
    UpdateBannerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminBannersApi(configuration);

let id: string; //Banner ID (default to undefined)
let updateBannerDto: UpdateBannerDto; //

const { status, data } = await apiInstance.adminBannerControllerUpdate(
    id,
    updateBannerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateBannerDto** | **UpdateBannerDto**|  | |
| **id** | [**string**] | Banner ID | defaults to undefined|


### Return type

**AdminBannerControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Banners reordered successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Resource not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

