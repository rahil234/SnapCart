# ProductsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productControllerCreate**](#productcontrollercreate) | **POST** /api/products | Create a new product|
|[**productControllerFindAll**](#productcontrollerfindall) | **GET** /api/products | Get all products (Admin)|
|[**productControllerFindOne**](#productcontrollerfindone) | **GET** /api/products/{id} | Get product by ID|
|[**productControllerUpdate**](#productcontrollerupdate) | **PATCH** /api/products/{id} | Update product|

# **productControllerCreate**
> productControllerCreate(createProductDto)

Creates a new product with the provided details. Only admins can create products.

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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Product created successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Authentication required |  -  |
|**403** | Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerFindAll**
> PaginatedProductsResponseDto productControllerFindAll()

Retrieves paginated list of all products with filtering and search. Admin access required.

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

**PaginatedProductsResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Products retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerFindOne**
> ProductResponseDto productControllerFindOne()

Retrieves a single product by its ID. Public endpoint.

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

**ProductResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product retrieved successfully |  -  |
|**400** | Invalid product ID format |  -  |
|**404** | Product not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **productControllerUpdate**
> productControllerUpdate(updateProductDto)

Updates an existing product. Only admins can update products.

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

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product updated successfully |  -  |
|**400** | Invalid input data or product ID format |  -  |
|**401** | Authentication required |  -  |
|**403** | Admin access required |  -  |
|**404** | Product not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

