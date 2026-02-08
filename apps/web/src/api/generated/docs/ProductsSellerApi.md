# ProductsSellerApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**sellerProductControllerActivateProduct**](#sellerproductcontrolleractivateproduct) | **PATCH** /api/seller/products/{id}/activate | Activate product|
|[**sellerProductControllerCreate**](#sellerproductcontrollercreate) | **POST** /api/seller/products | Create new product|
|[**sellerProductControllerDeactivateProduct**](#sellerproductcontrollerdeactivateproduct) | **PATCH** /api/seller/products/{id}/deactivate | Deactivate product|
|[**sellerProductControllerGetSellerProducts**](#sellerproductcontrollergetsellerproducts) | **GET** /api/seller/products | Get seller products|
|[**sellerProductControllerUpdate**](#sellerproductcontrollerupdate) | **PATCH** /api/seller/products/{id} | Update product|

# **sellerProductControllerActivateProduct**
> MessageOnlyResponse sellerProductControllerActivateProduct()

Seller activates their product to make it visible in marketplace.

### Example

```typescript
import {
    ProductsSellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsSellerApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.sellerProductControllerActivateProduct(
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

# **sellerProductControllerCreate**
> ProductControllerUpdate200Response sellerProductControllerCreate(createProductDto)

Seller creates a new product catalog entry.

### Example

```typescript
import {
    ProductsSellerApi,
    Configuration,
    CreateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsSellerApi(configuration);

let createProductDto: CreateProductDto; //

const { status, data } = await apiInstance.sellerProductControllerCreate(
    createProductDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProductDto** | **CreateProductDto**|  | |


### Return type

**ProductControllerUpdate200Response**

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

# **sellerProductControllerDeactivateProduct**
> MessageOnlyResponse sellerProductControllerDeactivateProduct()

Seller deactivates their product to hide it from marketplace.

### Example

```typescript
import {
    ProductsSellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsSellerApi(configuration);

let id: string; //Product UUID (default to undefined)

const { status, data } = await apiInstance.sellerProductControllerDeactivateProduct(
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

# **sellerProductControllerGetSellerProducts**
> SellerProductControllerGetSellerProducts200Response sellerProductControllerGetSellerProducts()

Retrieves all products owned by the seller. Shows all statuses.

### Example

```typescript
import {
    ProductsSellerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsSellerApi(configuration);

let page: number; //Page number (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term for product name or description (optional) (default to undefined)
let categoryId: string; //Filter by category ID (optional) (default to undefined)
let status: string; //Filter by product status (optional) (default to undefined)
let sortBy: 'name' | 'price' | 'createdAt'; //Sort by field (optional) (default to 'createdAt')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'desc')

const { status, data } = await apiInstance.sellerProductControllerGetSellerProducts(
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

**SellerProductControllerGetSellerProducts200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Seller products retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sellerProductControllerUpdate**
> ProductControllerUpdate200Response sellerProductControllerUpdate(updateProductDto)

Seller updates their own product information.

### Example

```typescript
import {
    ProductsSellerApi,
    Configuration,
    UpdateProductDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsSellerApi(configuration);

let id: string; //Product UUID (default to undefined)
let updateProductDto: UpdateProductDto; //

const { status, data } = await apiInstance.sellerProductControllerUpdate(
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

**ProductControllerUpdate200Response**

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

