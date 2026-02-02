# LoginDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identifier** | **string** | Email or phone number | [default to undefined]
**method** | **string** | Authentication method (PASSWORD or OTP only) | [default to undefined]
**password** | **string** | Password (required for PASSWORD method) | [optional] [default to undefined]
**otp** | **string** | OTP code (required for OTP method) | [optional] [default to undefined]

## Example

```typescript
import { LoginDto } from './api';

const instance: LoginDto = {
    identifier,
    method,
    password,
    otp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
