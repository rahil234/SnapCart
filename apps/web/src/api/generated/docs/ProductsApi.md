# ProductsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productControllerActivateProduct**](#productcontrolleractivateproduct) | **PATCH** /api/products/{id}/activate | Activate product|
|[**productControllerCreate**](#productcontrollercreate) | **POST** /api/products | Create new product (catalog entry)|
|[**productControllerDeactivateProduct**](#productcontrollerdeactivateproduct) | **PATCH** /api/products/{id}/deactivate | Deactivate product|
|[**productControllerDeleteProduct**](#productcontrollerdeleteproduct) | **DELETE** /api/products/{id} | Delete product (soft delete)|
|[**productControllerDiscontinueProduct**](#productcontrollerdiscontinueproduct) | **PATCH** /api/products/{id}/discontinue | Discontinue product (permanent)|
|[**productControllerFindAll**](#productcontrollerfindall) | **GET** /api/products | List all products (with pagination)|
|[**productControllerFindOne**](#productcontrollerfindone) | **GET** /api/products/{id} | Get product by ID|
|[**productControllerGetProductWithVariants**](#productcontrollergetproductwithvariants) | **GET** /api/products/{id}/with-variants | Get product with all variants|
|[**productControllerUpdate**](#productcontrollerupdate) | **PATCH** /api/products/{id} | Update product information|

# **productControllerActivateProduct**
> MessageOnlyResponse productControllerActivateProduct()

Makes product visible in catalog.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerActivateProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


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
|**200** | Product activated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerCreate**
> ProductControllerCreate201Response productControllerCreate(createProductDto)

Creates a product catalog entry. This is NOT sellable yet - you must add variants to make it purchasable.

### Example

```typescript
import {
    ProductsApi,
    Configuration,
    CreateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

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

**ProductControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Product created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerDeactivateProduct**
> MessageOnlyResponse productControllerDeactivateProduct()

Hides product from catalog.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerDeactivateProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


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
|**200** | Product deactivated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerDeleteProduct**
> MessageOnlyResponse productControllerDeleteProduct()

Soft deletes product. Admin only.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerDeleteProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


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
|**200** | Product deleted successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerDiscontinueProduct**
> MessageOnlyResponse productControllerDiscontinueProduct()

Permanently removes product. ONE-WAY operation.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerDiscontinueProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


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
|**200** | Product discontinued successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerFindAll**
> ProductControllerFindAll200Response productControllerFindAll()

Retrieves paginated list of products with optional filtering.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let page: number; //Page number (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term for product name or description (optional) (default to undefined)
let categoryId: string; //Filter by category ID (optional) (default to undefined)
let status: string; //Filter by product status (optional) (default to undefined)
let sortBy: 'name' | 'price' | 'createdAt'; //Sort by field (optional) (default to 'createdAt')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'desc')

const { status, data } = await apiInstance.productControllerFindAll(
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

**ProductControllerFindAll200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Products retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerFindOne**
> ProductControllerCreate201Response productControllerFindOne()

Retrieves detailed product information.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


### Return type

**ProductControllerCreate201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerGetProductWithVariants**
> ProductControllerGetProductWithVariants200Response productControllerGetProductWithVariants()

Returns product details along with all variants. Useful for product detail pages.

### Example

```typescript
import {
    ProductsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.productControllerGetProductWithVariants(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product UUID | defaults to undefined|


### Return type

**ProductControllerGetProductWithVariants200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product with variants retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerUpdate**
> ProductControllerCreate201Response productControllerUpdate(updateProductDto)

Updates catalog information only. Does NOT affect pricing or stock.

### Example

```typescript
import {
    ProductsApi,
    Configuration,
    UpdateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsApi(configuration);

let id: string; //Product UUID (default to undefined)
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
| **id** | [**string**] | Product UUID | defaults to undefined|


### Return type

**ProductControllerCreate201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

