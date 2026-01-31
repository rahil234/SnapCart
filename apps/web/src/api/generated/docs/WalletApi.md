# WalletApi

All URIs are relative to *http://api.dev.cloudberrytryon.com*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**walletControllerAddFunds**](#walletcontrolleraddfunds) | **POST** /api/payment/add-funds | |
|[**walletControllerGetBalance**](#walletcontrollergetbalance) | **GET** /api/payment/balance | |
|[**walletControllerGetTransactions**](#walletcontrollergettransactions) | **GET** /api/payment/transactions | |

# **walletControllerAddFunds**
> HttpResponseWithoutData walletControllerAddFunds()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletControllerAddFunds();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HttpResponseWithoutData**

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

# **walletControllerGetBalance**
> HttpResponseWithoutData walletControllerGetBalance()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletControllerGetBalance();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HttpResponseWithoutData**

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

# **walletControllerGetTransactions**
> HttpResponseWithoutData walletControllerGetTransactions()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletControllerGetTransactions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HttpResponseWithoutData**

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

