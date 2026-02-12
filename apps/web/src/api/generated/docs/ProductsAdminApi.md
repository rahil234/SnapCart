# ProductsAdminApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminProductControllerDiscontinueProduct**](#adminproductcontrollerdiscontinueproduct) | **PATCH** /api/admin/products/{id}/discontinue | Discontinue product (permanent)|
|[**adminProductControllerGetAdminProducts**](#adminproductcontrollergetadminproducts) | **GET** /api/admin/products | Get all products (admin)|
|[**adminProductControllerUpdateProductStatus**](#adminproductcontrollerupdateproductstatus) | **PATCH** /api/admin/products/{id}/status | Update product status|

# **adminProductControllerDiscontinueProduct**
> MessageOnlyResponse adminProductControllerDiscontinueProduct()

Admin permanently discontinues a product. ONE-WAY operation.

### Example

```typescript
import {
    ProductsAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsAdminApi(configuration);

let id: string; //Product CUID (default to undefined)

const { status, data } = await apiInstance.adminProductControllerDiscontinueProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Product CUID | defaults to undefined|


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

# **adminProductControllerGetAdminProducts**
> AdminProductControllerGetAdminProducts200Response adminProductControllerGetAdminProducts()

Retrieves all products with all statuses for admin governance.

### Example

```typescript
import {
    ProductsAdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsAdminApi(configuration);

let page: number; //Page number (optional) (default to 1)
let limit: number; //Number of items per page (optional) (default to 10)
let search: string; //Search term for product name or description (optional) (default to undefined)
let categoryId: string; //Filter by category ID (optional) (default to undefined)
let status: string; //Filter by product status (optional) (default to undefined)
let sortBy: 'name' | 'price' | 'createdAt'; //Sort by field (optional) (default to 'createdAt')
let sortOrder: 'asc' | 'desc'; //Sort order (optional) (default to 'desc')

const { status, data } = await apiInstance.adminProductControllerGetAdminProducts(
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

**AdminProductControllerGetAdminProducts200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Admin products retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **adminProductControllerUpdateProductStatus**
> MessageOnlyResponse adminProductControllerUpdateProductStatus(updateProductStatusDto)

Admin changes product status for governance.

### Example

```typescript
import {
    ProductsAdminApi,
    Configuration,
    UpdateProductStatusDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductsAdminApi(configuration);

let id: string; //Product CUID (default to undefined)
let updateProductStatusDto: UpdateProductStatusDto; //

const { status, data } = await apiInstance.adminProductControllerUpdateProductStatus(
    id,
    updateProductStatusDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProductStatusDto** | **UpdateProductStatusDto**|  | |
| **id** | [**string**] | Product CUID | defaults to undefined|


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
|**200** | Product status updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

