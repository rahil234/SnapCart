# UploadUrlResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**provider** | **string** | Storage provider | [default to undefined]
**uploadUrl** | **string** | Upload URL | [default to undefined]
**method** | **string** | HTTP method to use for upload | [default to undefined]
**fields** | **object** | Additional fields required for upload (for cloudinary) | [optional] [default to undefined]
**readUrl** | **string** | Read URL for the uploaded file (for azure) | [optional] [default to undefined]

## Example

```typescript
import { UploadUrlResponseDto } from './api';

const instance: UploadUrlResponseDto = {
    provider,
    uploadUrl,
    method,
    fields,
    readUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
