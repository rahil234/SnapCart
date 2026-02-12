# ResetPasswordDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**identifier** | **string** | Email or phone number | [default to undefined]
**otp** | **string** | OTP code (4 digits) | [default to undefined]
**newPassword** | **string** | New password (min 6 characters) | [default to undefined]

## Example

```typescript
import { ResetPasswordDto } from './api';

const instance: ResetPasswordDto = {
    identifier,
    otp,
    newPassword,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
