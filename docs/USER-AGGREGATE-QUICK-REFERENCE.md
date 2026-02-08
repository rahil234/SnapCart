# User Aggregate Quick Reference

## 🎯 Quick Commands

### Create Customer User
```typescript
const user = User.create(
  'user@example.com',
  null,
  'password123',
  UserRole.CUSTOMER
);
const profile = user.createCustomerProfile('John Doe');
await userRepository.save(user);
```

### Create Seller User
```typescript
const user = User.create(
  'seller@example.com',
  null,
  'password123',
  UserRole.SELLER
);
const profile = user.upgradeToSeller('My Store', 'GST123');
await userRepository.save(user);
```

### Upgrade Customer to Seller (Dual Role)
```typescript
const user = await userRepository.findById(userId);
const sellerProfile = user.upgradeToSeller('My Store');
await userRepository.update(user);
```

### Update User Profile
```typescript
const user = await userRepository.findById(userId);
user.updateEmail('newemail@example.com');
user.updateCustomerProfile('John Smith', new Date('1990-01-01'), UserGender.MALE);
await userRepository.update(user);
```

### Add Address (with validation)
```typescript
const user = await userRepository.findById(userId);

if (!user.canAddAddress()) {
  throw new Error('Customer profile required');
}

const customerId = user.getCustomerProfile()!.getId();
const address = Address.create(customerId, houseNo, street, city, state, country, pincode);
await addressRepository.save(address);
```

---

## 🔑 Key Methods

### Factory Methods
| Method | Description |
|--------|-------------|
| `User.create(email, phone, password, role)` | Create new user (enforces email OR phone) |
| `User.from(id, email, phone, ...)` | Reconstruct from persistence |

### Profile Management
| Method | Business Rule |
|--------|---------------|
| `createCustomerProfile(name?, dob?, gender?)` | ✅ User must be ACTIVE<br>✅ Cannot duplicate |
| `upgradeToSeller(storeName, gst?)` | ✅ User must be ACTIVE<br>✅ Store name required<br>✅ Keeps CustomerProfile if exists |
| `updateCustomerProfile(name?, dob?, gender?)` | ✅ Profile must exist |
| `updateSellerProfile(storeName?, gst?)` | ✅ Profile must exist |
| `verifySeller()` | ✅ SellerProfile must exist |

### Business Validations
| Method | Returns | Use Case |
|--------|---------|----------|
| `canAddAddress()` | boolean | Validate before creating Address |
| `canPerformCustomerOperations()` | boolean | Check for Cart/Order operations |
| `canPerformSellerOperations()` | boolean | Check for Product/Inventory operations |

### Status Management
| Method | Rule |
|--------|------|
| `activate()` | ✅ Cannot activate DISABLED accounts |
| `suspend()` | ✅ Temporary suspension |
| `disable()` | ⚠️ One-way operation (permanent) |

### Contact Updates
| Method | Invariant |
|--------|-----------|
| `updateEmail(email)` | ✅ Cannot remove if phone is null |
| `updatePhone(phone)` | ✅ Cannot remove if email is null |
| `updatePassword(password)` | ✅ Minimum 6 characters |

---

## 📊 Invariants Reference

### Must Always Be True
1. ✅ User has email **OR** phone (at least one)
2. ✅ CUSTOMER role → CustomerProfile exists
3. ✅ SELLER role → SellerProfile exists
4. ✅ Only ACTIVE users can create profiles
5. ✅ DISABLED accounts cannot be reactivated
6. ✅ CustomerProfile required for addresses

### Validation Flow
```
User.create()
    ↓
Validate email OR phone
    ↓
Create User instance
    ↓
validateInvariants() (automatic)
    ↓
✅ User ready
```

---

## 🗄️ Repository Operations

### Load Aggregate (with profiles)
```typescript
// Automatically includes CustomerProfile and SellerProfile
const user = await userRepository.findById(userId);

// Access profiles
const customerProfile = user.getCustomerProfile();
const sellerProfile = user.getSellerProfile();
```

### Save Aggregate (with transaction)
```typescript
// Creates User + Profiles in single transaction
await userRepository.save(user);
```

### Update Aggregate (with transaction)
```typescript
// Updates User + Profiles with upsert
await userRepository.update(user);
```

### Query Methods
```typescript
await userRepository.findById(id);
await userRepository.findByEmail(email);
await userRepository.findByPhone(phone);
await userRepository.findAll(skip, take, search, status);
```

---

## 🎨 Role Scenarios

### Scenario Matrix
| Initial Role | Action | Result | Has Customer Profile | Has Seller Profile |
|--------------|--------|--------|---------------------|-------------------|
| CUSTOMER | Create user | Auto-creates CustomerProfile | ✅ | ❌ |
| SELLER | Create user | Must call upgradeToSeller() | ❌ | ✅ |
| CUSTOMER | Upgrade to seller | Becomes SELLER, keeps CustomerProfile | ✅ | ✅ |

### Code Examples

#### Customer Only
```typescript
const user = User.create(email, phone, pass, UserRole.CUSTOMER);
user.createCustomerProfile('John');

user.canPerformCustomerOperations(); // true
user.canPerformSellerOperations();   // false
```

#### Seller Only
```typescript
const user = User.create(email, phone, pass, UserRole.SELLER);
user.upgradeToSeller('Store');

user.canPerformCustomerOperations(); // false
user.canPerformSellerOperations();   // true
```

#### Dual Role (Customer + Seller)
```typescript
const user = User.create(email, phone, pass, UserRole.CUSTOMER);
user.createCustomerProfile('John');
user.upgradeToSeller('Store');

user.canPerformCustomerOperations(); // true ✅
user.canPerformSellerOperations();   // true ✅
```

---

## 🔍 Getters Reference

### Identity
```typescript
user.getId(): string
user.getEmail(): string | null
user.getPhone(): string | null
user.getEmailValueObject(): Email | null
user.getPhoneValueObject(): Phone | null
```

### Profiles
```typescript
user.getCustomerProfile(): CustomerProfile | null
user.getSellerProfile(): SellerProfile | null
user.hasCustomerProfile(): boolean
user.hasSellerProfile(): boolean
```

### Status & Role
```typescript
user.getStatus(): AccountStatus
user.getRole(): UserRole
user.isActive(): boolean
user.isSuspended(): boolean
user.isDisabled(): boolean
user.isCustomer(): boolean
user.isSeller(): boolean
user.isAdmin(): boolean
```

---

## ⚠️ Common Pitfalls

### ❌ DON'T: Create profiles separately
```typescript
// BAD - Bypasses aggregate invariants
const profile = CustomerProfile.create(userId, name);
await customerProfileRepository.save(profile);
```

### ✅ DO: Use aggregate methods
```typescript
// GOOD - Enforces business rules
const user = await userRepository.findById(userId);
user.createCustomerProfile(name);
await userRepository.update(user);
```

### ❌ DON'T: Update profiles directly
```typescript
// BAD - Loses aggregate consistency
const profile = await customerProfileRepository.findByUserId(userId);
profile.updateName(name);
await customerProfileRepository.update(profile);
```

### ✅ DO: Update through aggregate
```typescript
// GOOD - Maintains aggregate boundary
const user = await userRepository.findById(userId);
user.updateCustomerProfile(name);
await userRepository.update(user);
```

### ❌ DON'T: Assign roles without profiles
```typescript
// BAD - Violates invariant
user.changeRole(UserRole.SELLER); // Error: no seller profile
```

### ✅ DO: Create profile first
```typescript
// GOOD - Satisfies invariants
user.upgradeToSeller('Store Name');
// Role automatically changes to SELLER
```

---

## 🧪 Testing Helpers

### Create Test User
```typescript
function createTestUser(role: UserRole = UserRole.CUSTOMER) {
  const user = User.create(
    `test-${Date.now()}@example.com`,
    null,
    'password123',
    role
  );
  
  if (role === UserRole.CUSTOMER) {
    user.createCustomerProfile('Test User');
  }
  
  return user;
}
```

### Assert Invariants
```typescript
function assertUserInvariants(user: User) {
  // Must have email or phone
  expect(user.getEmail() || user.getPhone()).toBeTruthy();
  
  // Role-profile consistency
  if (user.isCustomer()) {
    expect(user.hasCustomerProfile()).toBe(true);
  }
  
  if (user.isSeller()) {
    expect(user.hasSellerProfile()).toBe(true);
  }
}
```

---

## 📈 Performance Tips

### 1. Load Only What You Need
```typescript
// If you only need User data (no profiles)
// Still loads profiles (can't avoid with current implementation)
// Consider adding a findByIdWithoutProfiles() if needed for performance
```

### 2. Batch Operations
```typescript
// Load multiple users with profiles
const users = await userRepository.findAll(0, 100);
// All profiles loaded in single query with includes
```

### 3. Avoid N+1 Queries
```typescript
// GOOD - Uses includes
const user = await userRepository.findById(id);
const profile = user.getCustomerProfile(); // No extra query

// BAD - Separate queries
const user = await userRepository.findById(id);
const profile = await customerProfileRepository.findByUserId(id); // Extra query
```

---

## 🔗 Related Files

### Domain Layer
- `domain/entities/user.entity.ts` - Aggregate Root
- `domain/entities/customer-profile.entity.ts`
- `domain/entities/seller-profile.entity.ts`
- `domain/value-objects/email.vo.ts`
- `domain/value-objects/phone.vo.ts`

### Application Layer
- `application/commands/create-user.command.ts`
- `application/commands/upgrade-to-seller.command.ts`
- `application/commands/handlers/create-user.handler.ts`
- `application/commands/handlers/upgrade-to-seller.handler.ts`

### Infrastructure Layer
- `infrastructure/persistence/repositories/prisma-user.repository.ts`
- `infrastructure/persistence/mappers/prisma-user.mapper.ts`

---

**Last Updated:** February 6, 2026  
**Status:** ✅ Production Ready
