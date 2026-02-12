# ProductsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**productControllerUpdate**](#productcontrollerupdate) | **PATCH** /api/products/{id} | Update product information|

# **productControllerUpdate**
> ProductControllerUpdate200Response productControllerUpdate(updateProductDto)

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

