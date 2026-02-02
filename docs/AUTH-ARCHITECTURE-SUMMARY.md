# Authentication Architecture Summary

## ✅ Implementation Complete: Separate Routes Strategy

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│         (Web, Mobile, Third-party Integrations)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      API Gateway / HTTP Interface       │
        └─────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────┐        ┌─────────────┐
    │  /login │         │ /login/ │        │    /login/  │
    │         │         │  google │        │    apple    │
    │ POST    │         │  POST   │        │    POST     │
    └─────────┘         └─────────┘        └─────────────┘
         │                    │                    │
         │                    │                    │ (Future)
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────────┐    ┌─────────────┐
    │  Login  │         │LoginWith    │    │LoginWith    │
    │ Command │         │GoogleCommand│    │AppleCommand │
    └─────────┘         └─────────────┘    └─────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐         ┌─────────────┐    ┌─────────────┐
    │  Login  │         │LoginWith    │    │LoginWith    │
    │ Handler │         │GoogleHandler│    │AppleHandler │
    └─────────┘         └─────────────┘    └─────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Domain Layer   │
                    │                 │
                    │  • User Entity  │
                    │  • Token Service│
                    │  • Events       │
                    └─────────────────┘
```

## Route Structure

### `/auth/login` (Standard Authentication)
**Supports:** PASSWORD, OTP methods only

**Request:**
```json
{
  "identifier": "user@example.com",
  "method": "PASSWORD",
  "password": "myPassword123"
}
```

**Handler:** `LoginHandler`
- Validates existing user credentials
- Supports password-based or OTP-based authentication
- Requires user to already exist in the system

**Dependencies:**
- `UserRepository`
- `PasswordHashService`
- `OTPRepository`
- `TokenService`

---

### `/auth/login/google` (Google OAuth)
**Supports:** Google OAuth 2.0 authentication

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Handler:** `LoginWithGoogleHandler`
- Verifies Google ID token
- Auto-creates user account if first-time login
- Creates associated customer profile
- No password required

**Dependencies:**
- `UserRepository`
- `CustomerProfileRepository`
- `GoogleAuthService`
- `TokenService`

---

## Command Pattern

### Separate Commands by Use Case

```typescript
// Standard Login
class LoginCommand {
  identifier: string;
  method: AuthMethod.PASSWORD | AuthMethod.OTP;
  password?: string;
  otp?: string;
}

// Google OAuth
class LoginWithGoogleCommand {
  idToken: string;
}

// Future: Apple OAuth
class LoginWithAppleCommand {
  idToken: string;
}
```

### Why Separate Commands?

1. **Single Responsibility** - Each command represents one distinct use case
2. **Type Safety** - Clear contract for what data is required
3. **Validation** - Simple, focused validation rules
4. **Documentation** - Self-documenting API design
5. **Testing** - Easy to test in isolation

---

## Handler Responsibilities

### LoginHandler
```typescript
execute(LoginCommand) {
  1. Find user by email/phone
  2. Verify user exists and is active
  3. Validate credentials:
     - If PASSWORD: compare hash
     - If OTP: verify OTP code
  4. Generate JWT tokens
  5. Emit UserLoggedInEvent
  6. Return tokens
}
```

### LoginWithGoogleHandler
```typescript
execute(LoginWithGoogleCommand) {
  1. Verify Google ID token
  2. Check if user exists by email
  3. If new user:
     - Create User entity
     - Create CustomerProfile
     - Emit UserRegisteredEvent
  4. Generate JWT tokens
  5. Emit UserLoggedInEvent
  6. Return tokens + isNewUser flag
}
```

---

## Domain Events

Both handlers emit domain events for cross-cutting concerns:

```typescript
// Emitted by both handlers
UserLoggedInEvent {
  userId: string;
  role: UserRole;
  authMethod: AuthMethod; // PASSWORD, OTP, or GOOGLE
}

// Only emitted by LoginWithGoogleHandler for new users
UserRegisteredEvent {
  userId: string;
  email: string;
  phone: string | null;
}
```

**Event Subscribers** (potential use cases):
- Analytics tracking
- Welcome email sending
- Audit logging
- User activity monitoring
- Referral program processing

---

## Shared Domain Services

Both handlers reuse common domain services:

### TokenService
```typescript
interface TokenService {
  generateAccessToken(payload): string;
  generateRefreshToken(payload): string;
  verifyAccessToken(token): TokenPayload;
  verifyRefreshToken(token): TokenPayload;
}
```

**Used by:** `LoginHandler`, `LoginWithGoogleHandler`, `RefreshTokenHandler`

### Event Bus
```typescript
eventBus.publish(new UserLoggedInEvent(...));
```

**Used by:** All authentication handlers

---

## Security Features

### Cookie-Based Token Storage
```typescript
// HTTP-only cookies prevent XSS attacks
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,        // HTTPS only in production
  sameSite: 'strict',  // CSRF protection
  maxAge: 15 * 60 * 1000  // 15 minutes
});

res.cookie('refresh_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### Token Rotation
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Refresh token endpoint for seamless renewal

### Google Token Verification
- Server-side verification using Google OAuth2 client
- Validates token signature and audience
- Prevents token forgery

---

## DDD Principles Applied

### 1. Bounded Contexts
```
Auth Context:
- Authentication logic
- Token management
- OAuth integration

User Context:
- User entity
- Customer profiles
- User repositories
```

### 2. Aggregate Roots
```typescript
User (Aggregate Root)
├── CustomerProfile (Entity)
├── Address (Value Object)
└── Wallet (Entity)
```

### 3. Domain Events
```typescript
// Cross-context communication
Auth Context emits → User Context listens
UserLoggedInEvent → Update last login timestamp
UserRegisteredEvent → Send welcome email
```

### 4. Repository Pattern
```typescript
// Domain interface (abstract)
interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

// Infrastructure implementation (concrete)
class PrismaUserRepository implements UserRepository {
  // Prisma-specific implementation
}
```

### 5. Dependency Inversion
```typescript
// Handler depends on abstraction, not implementation
class LoginWithGoogleHandler {
  constructor(
    @Inject('GoogleAuthService')  // Interface
    private googleAuthService: GoogleAuthService
  ) {}
}

// Module binds interface to implementation
providers: [
  {
    provide: 'GoogleAuthService',
    useClass: GoogleOAuth2Service  // Concrete implementation
  }
]
```

---

## Extension Points

### Adding New OAuth Providers

**Step 1:** Create domain service interface
```typescript
// domain/services/apple-auth.service.ts
export interface AppleAuthService {
  verifyIdToken(idToken: string): Promise<UserInfo>;
}
```

**Step 2:** Create command
```typescript
// application/commands/login-with-apple.command.ts
export class LoginWithAppleCommand {
  constructor(public readonly idToken: string) {}
}
```

**Step 3:** Create handler
```typescript
// application/commands/handlers/login-with-apple.handler.ts
@CommandHandler(LoginWithAppleCommand)
export class LoginWithAppleHandler {
  // Similar to LoginWithGoogleHandler
}
```

**Step 4:** Implement service
```typescript
// infrastructure/services/apple-oauth.service.ts
@Injectable()
export class AppleOAuthService implements AppleAuthService {
  async verifyIdToken(idToken: string) {
    // Apple-specific verification
  }
}
```

**Step 5:** Add route
```typescript
// interfaces/http/auth.controller.ts
@Post('login/apple')
async loginWithApple(@Body() dto: LoginWithAppleDto) {
  const command = new LoginWithAppleCommand(dto.idToken);
  return await this.commandBus.execute(command);
}
```

**Step 6:** Register in module
```typescript
providers: [
  LoginWithAppleHandler,
  { provide: 'AppleAuthService', useClass: AppleOAuthService }
]
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('LoginWithGoogleHandler', () => {
  // Test new user creation
  it('should create user on first login', async () => {
    mockGoogleAuthService.verifyIdToken.mockResolvedValue({
      email: 'new@gmail.com',
      name: 'New User'
    });
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    const result = await handler.execute(command);
    
    expect(result.isNewUser).toBe(true);
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  // Test existing user login
  it('should login existing user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    
    const result = await handler.execute(command);
    
    expect(result.isNewUser).toBe(false);
    expect(result.accessToken).toBeDefined();
  });

  // Test invalid token
  it('should throw on invalid Google token', async () => {
    mockGoogleAuthService.verifyIdToken.mockRejectedValue(
      new UnauthorizedException()
    );
    
    await expect(handler.execute(command))
      .rejects.toThrow(UnauthorizedException);
  });
});
```

### Integration Tests

```typescript
describe('Auth Controller (e2e)', () => {
  it('should authenticate via Google OAuth', () => {
    return request(app.getHttpServer())
      .post('/auth/login/google')
      .send({ idToken: 'valid-google-token' })
      .expect(200)
      .expect((res) => {
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.body.message).toContain('logged in');
      });
  });

  it('should reject invalid Google token', () => {
    return request(app.getHttpServer())
      .post('/auth/login/google')
      .send({ idToken: 'invalid-token' })
      .expect(401);
  });
});
```

---

## API Documentation (Swagger)

The separate routes provide clear, self-documenting API:

```
Auth Endpoints:
├── POST /auth/login
│   ├── Body: { identifier, method, password?, otp? }
│   ├── Methods: PASSWORD, OTP
│   └── Returns: HTTP 200 + cookies
│
├── POST /auth/login/google
│   ├── Body: { idToken }
│   └── Returns: HTTP 200 + cookies + isNewUser flag
│
├── POST /auth/otp/request
│   └── Body: { identifier }
│
├── POST /auth/otp/verify
│   └── Body: { identifier, otp }
│
├── POST /auth/refresh
│   └── Uses refresh_token cookie
│
└── POST /auth/logout
    └── Clears auth cookies
```

---

## Conclusion

The **separate routes strategy** provides:

✅ Clear separation of concerns  
✅ Single Responsibility Principle  
✅ Open/Closed Principle for extensions  
✅ Type-safe, self-documenting API  
✅ Independent testability  
✅ Reduced coupling  
✅ Better maintainability  

This architecture aligns perfectly with DDD principles and positions the application for easy scaling as new authentication methods are added.

---

**Related Documentation:**
- [GOOGLE-OAUTH-IMPLEMENTATION.md](./GOOGLE-OAUTH-IMPLEMENTATION.md) - Detailed implementation guide
- [DDD-QUICK-REFERENCE.md](./DDD-QUICK-REFERENCE.md) - DDD patterns and templates
- [DDD-MIGRATION-GUIDE.md](./DDD-MIGRATION-GUIDE.md) - Migration strategies
