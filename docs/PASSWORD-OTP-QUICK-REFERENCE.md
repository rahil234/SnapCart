# Quick Reference: Password Management & OTP Authentication

## API Endpoints

### Password Management

#### Change Password (Protected)
```http
POST /api/auth/password/change
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

#### Forgot Password (Public)
```http
POST /api/auth/password/forgot
Content-Type: application/json

{
  "identifier": "user@example.com" // or phone number
}

Response: 200 OK
{
  "message": "Password reset OTP sent successfully"
}
```

#### Reset Password (Public)
```http
POST /api/auth/password/reset
Content-Type: application/json

{
  "identifier": "user@example.com",
  "otp": "1234",
  "newPassword": "newpass123"
}

Response: 200 OK
{
  "message": "Password reset successfully"
}
```

### OTP Management

#### Request OTP (Public)
```http
POST /api/auth/otp/request
Content-Type: application/json

{
  "identifier": "user@example.com" // or phone number
}

Response: 200 OK
{
  "message": "OTP sent successfully"
}
```

#### Verify OTP (Public)
```http
POST /api/auth/otp/verify
Content-Type: application/json

{
  "identifier": "user@example.com",
  "otp": "1234"
}

Response: 200 OK
{
  "message": "OTP verified successfully"
}
```

#### Login with OTP (Public)
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "method": "OTP",
  "otp": "1234"
}

Response: 200 OK
{
  "message": "User logged in successfully"
}
// Sets httpOnly cookies: access_token, refresh_token
```

#### Login with Password (Public)
```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "method": "PASSWORD",
  "password": "password123"
}

Response: 200 OK
{
  "message": "User logged in successfully"
}
```

#### Register (Public)
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com", // optional if phone provided
  "phone": "+1234567890",        // optional if email provided
  "password": "password123"
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

## Frontend Services

### AuthService

```typescript
import { AuthService } from '@/services/auth.service';

// Change password (authenticated users)
await AuthService.changePassword({
  currentPassword: 'oldpass',
  newPassword: 'newpass'
});

// Forgot password - Request OTP
await AuthService.forgotPassword({
  identifier: 'user@example.com'
});

// Reset password with OTP
await AuthService.resetPassword({
  identifier: 'user@example.com',
  otp: '1234',
  newPassword: 'newpass'
});

// Request OTP
await AuthService.requestOTP({
  identifier: 'user@example.com'
});

// Verify OTP
await AuthService.verifyOTP('user@example.com', '1234');

// Login
await AuthService.userLogin({
  email: 'user@example.com',
  password: 'password123'
});

// Register
await AuthService.register({
  email: 'user@example.com',
  password: 'password123'
});
```

## Component Examples

### Change Password Form

```typescript
import { AuthService } from '@/services/auth.service';

const handleChangePassword = async (data) => {
  try {
    await AuthService.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    toast.success('Password changed successfully');
  } catch (error) {
    toast.error('Failed to change password');
  }
};
```

### Forgot Password Flow

```typescript
// Step 1: Request OTP
const handleForgotPassword = async (email) => {
  await AuthService.forgotPassword({ identifier: email });
  setActiveTab('verify-otp');
};

// Step 2: Verify OTP
const handleVerifyOTP = async (otp) => {
  await AuthService.verifyOTP(email, otp);
  setVerifiedOtp(otp);
  setActiveTab('new-password');
};

// Step 3: Reset Password
const handleResetPassword = async (newPassword) => {
  await AuthService.resetPassword({
    identifier: email,
    otp: verifiedOtp,
    newPassword: newPassword,
  });
  setActiveTab('login');
};
```

## Error Handling

### Common Error Responses

```typescript
// 400 Bad Request
{
  "statusCode": 400,
  "message": "Invalid OTP",
  "error": "Bad Request"
}

// 401 Unauthorized
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}

// 409 Conflict
{
  "statusCode": 409,
  "message": "User already exists",
  "error": "Conflict"
}
```

## OTP Configuration

### Default Settings
- **OTP Length**: 4 digits
- **Validity**: 5 minutes
- **Max Attempts**: 3
- **Format**: Numeric only

### OTP Session Lifecycle

```typescript
// OTP Generation
const otp = Math.floor(1000 + Math.random() * 9000).toString();

// OTP Validation Rules
1. Must not be expired (> 5 minutes)
2. Must not be already verified
3. Must not exceed 3 attempts
4. Must match the stored code
```

## Security Best Practices

### Password Requirements
- Minimum length: 6 characters (recommended 8+)
- Must be different from current password
- Hashed using bcrypt before storage

### OTP Security
- One-time use only
- Time-limited (5 minutes)
- Attempt-limited (3 tries)
- Latest session takes precedence

### Authentication
- JWT tokens in httpOnly cookies
- Access token: 15 minutes
- Refresh token: 7 days
- Secure flag enabled in production

## Testing Commands

### Backend
```bash
cd apps/api

# Test change password
curl -X POST http://localhost:4000/api/auth/password/change \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old","newPassword":"new"}'

# Test forgot password
curl -X POST http://localhost:4000/api/auth/password/forgot \
  -H "Content-Type: application/json" \
  -d '{"identifier":"user@example.com"}'

# Test reset password
curl -X POST http://localhost:4000/api/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{"identifier":"user@example.com","otp":"1234","newPassword":"new"}'
```

### Frontend
```bash
cd apps/web

# Run development server
pnpm dev

# Test pages:
# - Change Password: /change-password
# - Login with OTP: / (click "Forgot Password")
```

## Troubleshooting

### OTP Not Received
- Check console logs (OTP is logged in development)
- Verify identifier (email/phone) is correct
- Check OTP session hasn't expired

### Password Change Fails
- Verify current password is correct
- Check new password meets requirements
- Ensure user is authenticated

### Reset Password Fails
- Verify OTP was verified successfully
- Check OTP hasn't expired
- Ensure identifier matches OTP session

## Environment Variables

```env
# Required for production OTP sending
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMS_API_KEY=your-sms-api-key
```

## Production Checklist

- [ ] Update OTPService to send real SMS
- [ ] Configure email service for OTP
- [ ] Add rate limiting for OTP requests
- [ ] Enable HTTPS for secure cookies
- [ ] Configure CORS properly
- [ ] Set up monitoring for auth events
- [ ] Add audit logging
- [ ] Test password reset flow end-to-end
- [ ] Test phone number authentication
- [ ] Configure SMS provider
