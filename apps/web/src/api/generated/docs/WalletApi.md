# WalletApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**walletControllerAddMoney**](#walletcontrolleraddmoney) | **POST** /api/wallet/add-money | Add money to wallet|
|[**walletControllerGetTransactions**](#walletcontrollergettransactions) | **GET** /api/wallet/transactions | Get wallet transactions|
|[**walletControllerGetWallet**](#walletcontrollergetwallet) | **GET** /api/wallet | Get wallet|
|[**walletControllerValidateBalance**](#walletcontrollervalidatebalance) | **POST** /api/wallet/validate-balance | Validate wallet balance|

# **walletControllerAddMoney**
> WalletControllerAddMoney201Response walletControllerAddMoney(addMoneyDto)

Adds funds to the customer wallet.

### Example

```typescript
import {
    WalletApi,
    Configuration,
    AddMoneyDto
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let addMoneyDto: AddMoneyDto; //

const { status, data } = await apiInstance.walletControllerAddMoney(
    addMoneyDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addMoneyDto** | **AddMoneyDto**|  | |


### Return type

**WalletControllerAddMoney201Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Money added successfully |  -  |
|**400** | Invalid amount or wallet inactive |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletControllerGetTransactions**
> WalletControllerGetTransactions200Response walletControllerGetTransactions()

Retrieves transaction history for the wallet with pagination.

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let limit: number; //Number of transactions to retrieve (optional) (default to 20)
let offset: number; //Offset for pagination (optional) (default to 0)

const { status, data } = await apiInstance.walletControllerGetTransactions(
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Number of transactions to retrieve | (optional) defaults to 20|
| **offset** | [**number**] | Offset for pagination | (optional) defaults to 0|


### Return type

**WalletControllerGetTransactions200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Transactions retrieved successfully |  -  |
|**404** | Wallet not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletControllerGetWallet**
> WalletControllerGetWallet200Response walletControllerGetWallet()

Retrieves wallet information for the authenticated customer. Creates wallet if not exists.

### Example

```typescript
import {
    WalletApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

const { status, data } = await apiInstance.walletControllerGetWallet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**WalletControllerGetWallet200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Wallet retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletControllerValidateBalance**
> WalletControllerValidateBalance200Response walletControllerValidateBalance(validateBalanceDto)

Checks if wallet has sufficient balance for the given amount.

### Example

```typescript
import {
    WalletApi,
    Configuration,
    ValidateBalanceDto
} from './api';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let validateBalanceDto: ValidateBalanceDto; //

const { status, data } = await apiInstance.walletControllerValidateBalance(
    validateBalanceDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **validateBalanceDto** | **ValidateBalanceDto**|  | |


### Return type

**WalletControllerValidateBalance200Response**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Balance validation completed |  -  |
|**400** | Invalid amount or wallet inactive |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

