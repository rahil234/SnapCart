# AuthenticationApi

All URIs are relative to *http://localhost:4000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /api/auth/login | Login with password or OTP|
|[**authControllerLoginWithGoogle**](#authcontrollerloginwithgoogle) | **POST** /api/auth/login/google | Login with Google|
|[**authControllerLogout**](#authcontrollerlogout) | **POST** /api/auth/logout | Logout|
|[**authControllerRefreshToken**](#authcontrollerrefreshtoken) | **POST** /api/auth/refresh | Refresh access token|
|[**authControllerRegister**](#authcontrollerregister) | **POST** /api/auth/register | Register a new user|
|[**authControllerRequestOTP**](#authcontrollerrequestotp) | **POST** /api/auth/otp/request | Request OTP|
|[**authControllerVerifyOTP**](#authcontrollerverifyotp) | **POST** /api/auth/otp/verify | Verify OTP|

# **authControllerLogin**
> authControllerLogin(loginDto)

Authenticate user with password or OTP

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.authControllerLogin(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User logged in successfully |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLoginWithGoogle**
> authControllerLoginWithGoogle(loginWithGoogleDto)

Authenticate user with Google OAuth

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginWithGoogleDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginWithGoogleDto: LoginWithGoogleDto; //

const { status, data } = await apiInstance.authControllerLoginWithGoogle(
    loginWithGoogleDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginWithGoogleDto** | **LoginWithGoogleDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User logged in successfully |  -  |
|**401** | Invalid Google token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogout**
> authControllerLogout()

Clear authentication cookies

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerLogout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User logged out successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshToken**
> authControllerRefreshToken()

Get new access token using refresh token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerRefreshToken();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token refreshed successfully |  -  |
|**401** | Invalid refresh token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegister**
> authControllerRegister(registerDto)

Creates a new customer account with email/phone and password

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RegisterDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let registerDto: RegisterDto; //

const { status, data } = await apiInstance.authControllerRegister(
    registerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerDto** | **RegisterDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User registered successfully |  -  |
|**409** | User already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRequestOTP**
> authControllerRequestOTP(requestOTPDto)

Send OTP to email or phone number

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RequestOTPDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let requestOTPDto: RequestOTPDto; //

const { status, data } = await apiInstance.authControllerRequestOTP(
    requestOTPDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestOTPDto** | **RequestOTPDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OTP sent successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyOTP**
> authControllerVerifyOTP(verifyOTPDto)

Verify OTP code

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    VerifyOTPDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let verifyOTPDto: VerifyOTPDto; //

const { status, data } = await apiInstance.authControllerVerifyOTP(
    verifyOTPDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyOTPDto** | **VerifyOTPDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OTP verified successfully |  -  |
|**401** | Invalid OTP |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

