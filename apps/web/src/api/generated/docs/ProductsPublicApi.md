# ProductsPublicApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productPublicControllerFindAll**](#productpubliccontrollerfindall) | **GET** /api/products | Browse marketplace products with preview|
|[**productPublicControllerFindOne**](#productpubliccontrollerfindone) | **GET** /api/products/{id} | Get product details with category|
|[**productPublicControllerGetProductWithVariants**](#productpubliccontrollergetproductwithvariants) | **GET** /api/products/{id}/with-variants | Get product with all variants and category|

# **productPublicControllerFindAll**
> ProductPublicControllerFindAll200Response productPublicControllerFindAll()

Retrieves paginated list of ACTIVE products with first variant and category. Perfect for homepage/listing pages. Public endpoint.

### Example

```typescript
import {
    ProductsPublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsPublicApi(configuration);

let page: number; //Page number (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term for product name or description (optional) (default to undefined)
let categoryId: string; //Filter by category ID (optional) (default to undefined)
let status: string; //Filter by product status (optional) (default to undefined)
let sortBy: 'name' | 'price' | 'createdAt'; //Sort by field (optional) (default to 'createdAt')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'desc')

const { status, data } = await apiInstance.productPublicControllerFindAll(
    page,
    limit,
    search,
    categoryId,
    status,
    sortBy,
    sortOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **limit** | [**number**] | Number of items per page | (optional) defaults to 10|
| **search** | [**string**] | Search term for product name or description | (optional) defaults to undefined|
| **categoryId** | [**string**] | Filter by category ID | (optional) defaults to undefined|
| **status** | [**string**] | Filter by product status | (optional) defaults to undefined|
| **sortBy** | [**&#39;name&#39; | &#39;price&#39; | &#39;createdAt&#39;**]**Array<&#39;name&#39; &#124; &#39;price&#39; &#124; &#39;createdAt&#39;>** | Sort by field | (optional) defaults to 'createdAt'|
| **sortOrder** | [**&#39;asc&#39; | &#39;desc&#39;**]**Array<&#39;asc&#39; &#124; &#39;desc&#39;>** | Sort order | (optional) defaults to 'desc'|


### Return type

**ProductPublicControllerFindAll200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Products with variant preview retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productPublicControllerFindOne**
> ProductPublicControllerFindOne200Response productPublicControllerFindOne()

Retrieves a single product by ID with category populated. Public endpoint.

### Example

```typescript
import {
    ProductsPublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsPublicApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productPublicControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


### Return type

**ProductPublicControllerFindOne200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product with category and variants retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productPublicControllerGetProductWithVariants**
> ProductPublicControllerGetProductWithVariants200Response productPublicControllerGetProductWithVariants()

Retrieves complete product details with category and all variants with images. Perfect for product detail pages. Public endpoint.

### Example

```typescript
import {
    ProductsPublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsPublicApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productPublicControllerGetProductWithVariants(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


### Return type

**ProductPublicControllerGetProductWithVariants200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product details with category and variants retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

