# ProductApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productControllerCreate**](#productcontrollercreate) | **POST** /api/product | |
|[**productControllerFind**](#productcontrollerfind) | **GET** /api/product | |
|[**productControllerFindFeed**](#productcontrollerfindfeed) | **GET** /api/product/feed | |
|[**productControllerFindOne**](#productcontrollerfindone) | **GET** /api/product/{id} | |
|[**productControllerUpdate**](#productcontrollerupdate) | **PATCH** /api/product/{id} | |

# **productControllerCreate**
> ProductControllerCreate200Response productControllerCreate(createProductDto)


### Example

```typescript
import {
    ProductApi,
    Configuration,
    CreateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let createProductDto: CreateProductDto; //

const { status, data } = await apiInstance.productControllerCreate(
    createProductDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProductDto** | **CreateProductDto**|  | |


### Return type

**ProductControllerCreate200Response**

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

# **productControllerFind**
> ProductControllerFind200Response productControllerFind()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let status: 'active' | 'inactive'; // (optional) (default to undefined)

const { status, data } = await apiInstance.productControllerFind(
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

**ProductControllerFind200Response**

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

# **productControllerFindFeed**
> ProductControllerFind200Response productControllerFindFeed()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let page: number; // (optional) (default to undefined)
let limit: number; // (optional) (default to undefined)
let search: string; // (optional) (default to undefined)
let sizes: Array<string>; //Array of sizes (optional) (default to undefined)
let minPrice: number; // (optional) (default to undefined)
let maxPrice: number; // (optional) (default to undefined)
let categories: Array<string>; //Array of category IDs (optional) (default to undefined)

const { status, data } = await apiInstance.productControllerFindFeed(
    page,
    limit,
    search,
    sizes,
    minPrice,
    maxPrice,
    categories
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to undefined|
| **search** | [**string**] |  | (optional) defaults to undefined|
| **sizes** | **Array&lt;string&gt;** | Array of sizes | (optional) defaults to undefined|
| **minPrice** | [**number**] |  | (optional) defaults to undefined|
| **maxPrice** | [**number**] |  | (optional) defaults to undefined|
| **categories** | **Array&lt;string&gt;** | Array of category IDs | (optional) defaults to undefined|


### Return type

**ProductControllerFind200Response**

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

# **productControllerFindOne**
> ProductControllerCreate200Response productControllerFindOne()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.productControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ProductControllerCreate200Response**

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

# **productControllerUpdate**
> ProductControllerCreate200Response productControllerUpdate(updateProductDto)


### Example

```typescript
import {
    ProductApi,
    Configuration,
    UpdateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: string; // (default to undefined)
let updateProductDto: UpdateProductDto; //

const { status, data } = await apiInstance.productControllerUpdate(
    id,
    updateProductDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProductDto** | **UpdateProductDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ProductControllerCreate200Response**

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

