# ProductVariantsApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**variantControllerActivateVariant**](#variantcontrolleractivatevariant) | **PATCH** /api/products/variants/{variantId}/activate | Activate variant|
|[**variantControllerCreateVariant**](#variantcontrollercreatevariant) | **POST** /api/products/{productId}/variants | Add variant to product|
|[**variantControllerDeactivateVariant**](#variantcontrollerdeactivatevariant) | **PATCH** /api/products/variants/{variantId}/deactivate | Deactivate variant|
|[**variantControllerDeleteVariant**](#variantcontrollerdeletevariant) | **DELETE** /api/products/variants/{variantId} | Delete variant (soft delete)|
|[**variantControllerDeleteVariantImage**](#variantcontrollerdeletevariantimage) | **DELETE** /api/products/variants/{variantId}/images/{position} | Delete variant image|
|[**variantControllerGetVariant**](#variantcontrollergetvariant) | **GET** /api/products/variants/{variantId} | Get variant by ID|
|[**variantControllerGetVariantsByProduct**](#variantcontrollergetvariantsbyproduct) | **GET** /api/products/{productId}/variants | List all variants for a product|
|[**variantControllerSaveVariantImage**](#variantcontrollersavevariantimage) | **POST** /api/products/variants/{variantId}/images/save | Save variant image|
|[**variantControllerUpdateStock**](#variantcontrollerupdatestock) | **PATCH** /api/products/variants/{variantId}/stock | Update variant stock|
|[**variantControllerUpdateVariant**](#variantcontrollerupdatevariant) | **PATCH** /api/products/variants/{variantId} | Update variant details|
|[**variantControllerUploadVariantImage**](#variantcontrolleruploadvariantimage) | **POST** /api/products/variants/{variantId}/images | Upload variant image|

# **variantControllerActivateVariant**
> MessageOnlyResponse variantControllerActivateVariant()

Makes variant available for purchase (if stock > 0).

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)

const { status, data } = await apiInstance.variantControllerActivateVariant(
    variantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Variant activated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerCreateVariant**
> VariantControllerCreateVariant201Response variantControllerCreateVariant(createVariantDto)

Creates a new sellable variant for an existing product. Required to make product purchasable.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration,
    CreateVariantDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let productId: string; //Product UUID to add variant to (default to undefined)
let createVariantDto: CreateVariantDto; //

const { status, data } = await apiInstance.variantControllerCreateVariant(
    productId,
    createVariantDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createVariantDto** | **CreateVariantDto**|  | |
| **productId** | [**string**] | Product UUID to add variant to | defaults to undefined|


### Return type

**VariantControllerCreateVariant201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Variant created successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Product not found |  -  |
|**409** | SKU already exists |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerDeactivateVariant**
> MessageOnlyResponse variantControllerDeactivateVariant()

Makes variant unavailable for purchase (temporarily).

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)

const { status, data } = await apiInstance.variantControllerDeactivateVariant(
    variantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Variant deactivated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerDeleteVariant**
> MessageOnlyResponse variantControllerDeleteVariant()

Soft deletes a variant. Admin only.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)

const { status, data } = await apiInstance.variantControllerDeleteVariant(
    variantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Variant deleted successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerDeleteVariantImage**
> MessageOnlyResponse variantControllerDeleteVariantImage()

Deletes an image associated with a variant.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)
let position: number; // (default to undefined)

const { status, data } = await apiInstance.variantControllerDeleteVariantImage(
    variantId,
    position
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant UUID | defaults to undefined|
| **position** | [**number**] |  | defaults to undefined|


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
|**200** | Image deleted successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerGetVariant**
> VariantControllerCreateVariant201Response variantControllerGetVariant()

Retrieves detailed information about a specific variant.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)

const { status, data } = await apiInstance.variantControllerGetVariant(
    variantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


### Return type

**VariantControllerCreateVariant201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Variant retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerGetVariantsByProduct**
> VariantControllerGetVariantsByProduct200Response variantControllerGetVariantsByProduct()

Returns all variants (sizes, types) available for a product.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let productId: string; //Product CUID (default to undefined)

const { status, data } = await apiInstance.variantControllerGetVariantsByProduct(
    productId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productId** | [**string**] | Product CUID | defaults to undefined|


### Return type

**VariantControllerGetVariantsByProduct200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Variants retrieved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerSaveVariantImage**
> MessageOnlyResponse variantControllerSaveVariantImage(saveVariantImageDto)

Saves the uploaded image information to the variant.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration,
    SaveVariantImageDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)
let saveVariantImageDto: SaveVariantImageDto; //

const { status, data } = await apiInstance.variantControllerSaveVariantImage(
    variantId,
    saveVariantImageDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **saveVariantImageDto** | **SaveVariantImageDto**|  | |
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Image saved successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerUpdateStock**
> MessageOnlyResponse variantControllerUpdateStock(updateVariantStockDto)

Dedicated endpoint for stock management. Supports set, add, and reduce operations.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration,
    UpdateVariantStockDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)
let updateVariantStockDto: UpdateVariantStockDto; //

const { status, data } = await apiInstance.variantControllerUpdateStock(
    variantId,
    updateVariantStockDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateVariantStockDto** | **UpdateVariantStockDto**|  | |
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Stock updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerUpdateVariant**
> MessageOnlyResponse variantControllerUpdateVariant(updateVariantDto)

Updates commerce attributes of a variant (price, stock, discount, etc.). Use dedicated endpoints for specific operations.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration,
    UpdateVariantDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant UUID (default to undefined)
let updateVariantDto: UpdateVariantDto; //

const { status, data } = await apiInstance.variantControllerUpdateVariant(
    variantId,
    updateVariantDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateVariantDto** | **UpdateVariantDto**|  | |
| **variantId** | [**string**] | Variant UUID | defaults to undefined|


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
|**200** | Variant updated successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **variantControllerUploadVariantImage**
> VariantControllerUploadVariantImage201Response variantControllerUploadVariantImage()

Uploads an image for a variant and associates it.

### Example

```typescript
import {
    ProductVariantsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductVariantsApi(configuration);

let variantId: string; //Variant CUID (default to undefined)

const { status, data } = await apiInstance.variantControllerUploadVariantImage(
    variantId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **variantId** | [**string**] | Variant CUID | defaults to undefined|


### Return type

**VariantControllerUploadVariantImage201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Image uploaded successfully |  -  |
|**400** | Invalid input data or validation failed |  -  |
|**401** | Authentication required |  -  |
|**403** | Insufficient permissions |  -  |
|**404** | Variant not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

