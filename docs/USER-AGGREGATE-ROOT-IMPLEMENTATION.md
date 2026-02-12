# User Aggregate Root Implementation - Complete ✅

## Overview

Successfully implemented the **User Aggregate Root** following proper Domain-Driven Design (DDD) principles for the SnapCart e-commerce platform. The User aggregate now encapsulates CustomerProfile and SellerProfile entities, enforcing strict business invariants and providing a clean API for profile management.

---

## 🏗️ Aggregate Structure

```
User (Aggregate Root)
├── Email (Value Object)
├── Phone (Value Object)
├── CustomerProfile (Optional Entity)
└── SellerProfile (Optional Entity)

Address (Separate Aggregate)
└── References CustomerProfile.id
```

### Key Design Decision
**Address is NOT part of User aggregate** because:
- Addresses reference `customerId` (not `userId`) in the database
- Addresses have independent lifecycle from User
- Business rule validation (CustomerProfile must exist) is enforced through User aggregate's `canAddAddress()` method

---

## 🔐 Invariants Enforced

### 1. Identity Invariants
- ✅ User must have **either email OR phone** (at least one)
- ✅ Email and Phone are validated through Value Objects
- ✅ Cannot remove both email and phone simultaneously

### 2. Profile Invariants
- ✅ CUSTOMER role **requires** CustomerProfile (auto-created on user creation)
- ✅ SELLER role requires SellerProfile (created via `upgradeToSeller()`)
- ✅ Users can have **both** CustomerProfile and SellerProfile (dual role)
- ✅ Cannot create duplicate profiles

### 3. Status Invariants
- ✅ Only **ACTIVE** users can create profiles
- ✅ DISABLED accounts **cannot be reactivated** (permanent operation)
- ✅ Status transitions: ACTIVE ↔ SUSPENDED → DISABLED (one-way to disabled)

### 4. Business Rule Invariants
- ✅ CustomerProfile required before adding addresses
- ✅ Date of birth cannot be in the future
- ✅ Store name required for seller profiles
- ✅ Password must be at least 6 characters

---

## 📋 Aggregate Root Methods

### Profile Creation

#### `createCustomerProfile(name?, dob?, gender?): CustomerProfile`
Creates customer profile for the user. Automatically assigns CUSTOMER role if not already set.

**Business Rules:**
- User must be ACTIVE
- Cannot create duplicate customer profile
- DOB cannot be in future
- Required for Cart and Order operations

**Example:**
```typescript
const user = User.create('user@example.com', null, 'password', UserRole.CUSTOMER);
const profile = user.createCustomerProfile('John Doe', new Date('1990-01-01'), UserGender.MALE);
```

#### `upgradeToSeller(storeName, gstNumber?): SellerProfile`
Upgrades user to seller or creates seller profile. Supports dual roles (Customer + Seller).

**Business Rules:**
- User must be ACTIVE
- Store name is required
- Cannot create duplicate seller profile
- User keeps CustomerProfile if already exists

**Example:**
```typescript
const user = await userRepository.findById(userId);
const sellerProfile = user.upgradeToSeller('My Store', 'GST12345');
```

### Profile Updates

#### `updateCustomerProfile(name?, dob?, gender?): void`
Updates customer profile details through aggregate root.

#### `updateSellerProfile(storeName?, gstNumber?): void`
Updates seller profile details through aggregate root.

#### `verifySeller(): void`
Marks seller as verified (admin operation).

#### `unverifySeller(): void`
Removes seller verification (admin operation).

### Contact Information

#### `updateEmail(newEmail): void`
Updates email with validation. Cannot remove if phone is not set.

#### `updatePhone(newPhone): void`
Updates phone with validation. Cannot remove if email is not set.

#### `updatePassword(newPassword): void`
Updates password with validation (min 6 characters).

### Status Management

#### `activate(): void`
Activates user account. **Cannot activate DISABLED accounts.**

#### `suspend(): void`
Temporarily suspends user account.

#### `disable(): void`
Permanently disables account (one-way operation).

### Business Rule Checks

#### `canAddAddress(): boolean`
Returns true if user has CustomerProfile and is ACTIVE.

#### `canPerformCustomerOperations(): boolean`
Returns true if user has CustomerProfile and is ACTIVE. Required for Cart/Order operations.

#### `canPerformSellerOperations(): boolean`
Returns true if user has SellerProfile and is ACTIVE. Required for Product/Inventory operations.

---

## 🗄️ Repository Implementation

### Aggregate Loading
The `PrismaUserRepository` loads the **complete aggregate** with all profiles:

```typescript
async findById(id: string): Promise<User | null> {
  const record = await this.prisma.user.findUnique({
    where: { id },
    include: {
      customerProfile: true,
      sellerProfile: true,
    },
  });
  return PrismaUserMapper.toDomain(record);
}
```

### Aggregate Persistence
The repository uses **transactions** to ensure atomicity when saving aggregates with profiles:

```typescript
async save(user: User): Promise<User> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Create user
    await tx.user.create({ data: userData });
    
    // 2. Create customer profile if exists
    if (user.getCustomerProfile()) {
      await tx.customerProfile.create({ data: profileData });
    }
    
    // 3. Create seller profile if exists
    if (user.getSellerProfile()) {
      await tx.sellerProfile.create({ data: profileData });
    }
    
    // 4. Return complete aggregate
    return await tx.user.findUnique({ where: { id }, include: { ... } });
  });
}
```

### Cascade Delete
Prisma schema updated with **CASCADE delete**:

```prisma
model CustomerProfile {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SellerProfile {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

When User is deleted, profiles are automatically deleted, preventing orphaned records.

---

## 🎯 Command Handlers

### CreateUserHandler
Automatically creates CustomerProfile for CUSTOMER role users:

```typescript
const user = User.create(email, phone, password, role);

if (role === UserRole.CUSTOMER) {
  const customerProfile = user.createCustomerProfile();
  // Emit CustomerProfileCreatedEvent
}

await userRepository.save(user); // Saves user + profile in transaction
```

### UpdateUserHandler
Updates user and profile through aggregate:

```typescript
const user = await userRepository.findById(userId);

user.updateEmail(newEmail);
user.updatePhone(newPhone);
user.updateCustomerProfile(name, dob, gender);

await userRepository.update(user); // Saves entire aggregate
```

### UpgradeToSellerHandler ✨ NEW
Handles seller upgrade with business rule validation:

```typescript
const user = await userRepository.findById(userId);
const sellerProfile = user.upgradeToSeller(storeName, gstNumber);

await userRepository.update(user);
// Emit SellerProfileCreatedEvent
```

### CreateAddressHandler
Validates through aggregate before creating address:

```typescript
const user = await userRepository.findById(userId);

if (!user.canAddAddress()) {
  throw new BadRequestException('User must have customer profile');
}

const customerProfile = user.getCustomerProfile();
const address = Address.create(customerProfile.getId(), ...addressData);
```

---

## 📊 Value Objects Integration

### Email Value Object
```typescript
export class Email {
  private constructor(private readonly value: string) {}
  
  static create(email: string | null): Email | null {
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    return new Email(email.toLowerCase().trim());
  }
  
  getValue(): string { return this.value; }
}
```

### Phone Value Object
```typescript
export class Phone {
  private constructor(private readonly value: string) {}
  
  static create(phone: string | null): Phone | null {
    if (!phone) return null;
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new Error('Invalid phone number length');
    }
    
    return new Phone(cleaned);
  }
  
  getValue(): string { return this.value; }
}
```

**Benefits:**
- ✅ Validation at domain level
- ✅ Immutability
- ✅ Type safety
- ✅ Business logic encapsulation

---

## 🔄 Role Transition Support

### Scenario 1: Customer Only
```typescript
// User creates account as customer
const user = User.create(email, phone, password, UserRole.CUSTOMER);
user.createCustomerProfile('John Doe');

// Can perform customer operations
user.canPerformCustomerOperations(); // true
user.canPerformSellerOperations();   // false
```

### Scenario 2: Seller Only
```typescript
// User creates account as seller
const user = User.create(email, phone, password, UserRole.SELLER);
user.upgradeToSeller('My Store');

// Can perform seller operations only
user.canPerformCustomerOperations(); // false
user.canPerformSellerOperations();   // true
```

### Scenario 3: Customer → Seller (Dual Role) ✨
```typescript
// User starts as customer
const user = User.create(email, phone, password, UserRole.CUSTOMER);
user.createCustomerProfile('John Doe');

// Later upgrades to seller (keeps customer profile)
user.upgradeToSeller('My Store');

// Can perform BOTH operations
user.canPerformCustomerOperations(); // true (has customer profile)
user.canPerformSellerOperations();   // true (has seller profile)
user.hasCustomerProfile();           // true
user.hasSellerProfile();             // true
```

**Key Design Decision:** Users can have both profiles because:
- Sellers may want to buy from other sellers
- Order history must be preserved when upgrading to seller
- Cart should continue working after seller upgrade

---

## 🎨 Architecture Layers

### Domain Layer
```typescript
domain/entities/
  ├── user.entity.ts           // Aggregate Root
  ├── customer-profile.entity.ts
  ├── seller-profile.entity.ts
  └── address.entity.ts        // Separate aggregate

domain/value-objects/
  ├── email.vo.ts
  └── phone.vo.ts

domain/enums/
  ├── user-role.enum.ts        // ADMIN, SELLER, CUSTOMER
  ├── account-status.enum.ts   // ACTIVE, SUSPENDED, DISABLED
  └── user-gender.enum.ts      // MALE, FEMALE, OTHER

domain/repositories/
  └── user.repository.ts       // Interface only
```

### Application Layer
```typescript
application/commands/
  ├── create-user.command.ts
  ├── update-user.command.ts
  └── upgrade-to-seller.command.ts  // ✨ NEW

application/commands/handlers/
  ├── create-user.handler.ts
  ├── update-user.handler.ts
  └── upgrade-to-seller.handler.ts  // ✨ NEW
```

### Infrastructure Layer
```typescript
infrastructure/persistence/
  ├── repositories/
  │   └── prisma-user.repository.ts  // Loads/saves aggregate
  └── mappers/
      └── prisma-user.mapper.ts      // Maps aggregate ↔ DB
```

---

## 🧪 Testing Strategy

### Unit Tests (Domain Layer)
```typescript
describe('User Aggregate', () => {
  it('should enforce email OR phone invariant', () => {
    expect(() => User.create(null, null, 'pass', UserRole.CUSTOMER))
      .toThrow('Either email or phone must be provided');
  });
  
  it('should create customer profile only for active users', () => {
    const user = User.create('test@test.com', null, 'pass', UserRole.CUSTOMER);
    user.suspend();
    
    expect(() => user.createCustomerProfile())
      .toThrow('Only active users can create customer profiles');
  });
  
  it('should support dual role (customer + seller)', () => {
    const user = User.create('test@test.com', null, 'pass', UserRole.CUSTOMER);
    user.createCustomerProfile('John');
    user.upgradeToSeller('My Store');
    
    expect(user.hasCustomerProfile()).toBe(true);
    expect(user.hasSellerProfile()).toBe(true);
  });
});
```

### Integration Tests (Application Layer)
```typescript
describe('CreateUserHandler', () => {
  it('should auto-create customer profile for CUSTOMER role', async () => {
    const command = new CreateUserCommand('test@test.com', null, 'pass', UserRole.CUSTOMER);
    const user = await handler.execute(command);
    
    expect(user.hasCustomerProfile()).toBe(true);
  });
});

describe('UpgradeToSellerHandler', () => {
  it('should create seller profile while keeping customer profile', async () => {
    // Create customer first
    const user = await createCustomer();
    
    // Upgrade to seller
    const command = new UpgradeToSellerCommand(user.id, 'My Store');
    const upgraded = await handler.execute(command);
    
    expect(upgraded.hasCustomerProfile()).toBe(true);
    expect(upgraded.hasSellerProfile()).toBe(true);
  });
});
```

---

## 📈 Benefits of This Implementation

### 1. ✅ Strong Invariants
- Business rules enforced at domain level
- Impossible to create invalid aggregates
- Compile-time safety with TypeScript

### 2. ✅ Transactional Integrity
- User + Profiles saved in single transaction
- No orphaned profiles
- Cascade delete prevents data inconsistency

### 3. ✅ Clean API
- All profile operations go through User aggregate
- Clear business semantics (`upgradeToSeller`, `canAddAddress`)
- No direct manipulation of child entities

### 4. ✅ Flexibility
- Supports dual roles (Customer + Seller)
- Preserves order history when upgrading to seller
- Cart continues working after role changes

### 5. ✅ Maintainability
- Business logic centralized in aggregate
- Easy to add new invariants
- Clear separation of concerns

### 6. ✅ Testability
- Pure domain logic (no dependencies)
- Easy to unit test invariants
- Integration tests verify persistence

---

## 🚀 Migration Steps

### 1. Database Migration
```bash
# Update Prisma schema with CASCADE delete
npx prisma migrate dev --name add-cascade-delete-to-profiles
```

### 2. No Code Changes Required
The implementation is **backward compatible**:
- Existing users without profiles continue working
- New users get CustomerProfile automatically (if CUSTOMER role)
- Existing handlers updated to use aggregate methods

### 3. Optional: Backfill CustomerProfiles
```sql
-- Create customer profiles for existing CUSTOMER users without profiles
INSERT INTO "CustomerProfile" (id, "userId", name, "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, NULL, NOW(), NOW()
FROM "User"
WHERE role = 'CUSTOMER' AND id NOT IN (SELECT "userId" FROM "CustomerProfile");
```

---

## 📝 Future Enhancements

### 1. Address as Aggregate Member
Consider making Address part of User aggregate if:
- Addresses are always loaded with User
- Address updates should be transactional with User
- Addresses don't have independent lifecycle

### 2. Role-Based Access Control
Extend aggregate with permission checks:
```typescript
user.can('create-product')      // Seller only
user.can('place-order')          // Customer only
user.can('manage-users')         // Admin only
```

### 3. Domain Events
Emit rich domain events:
```typescript
UserUpgradedToSellerEvent
UserCustomerProfileCompletedEvent
UserVerifiedEvent
```

### 4. Aggregate Versioning
Add optimistic locking:
```typescript
class User {
  private version: number;
  
  // Increment version on every change
  // Detect concurrent modifications
}
```

---

## 📚 Related Documentation

- [DDD Cheat Sheet](./DDD-CHEAT-SHEET.md)
- [DDD Folder Structure](./DDD-FOLDER-STRUCTURE.md)
- [User Module Migration Complete](./USER-MODULE-MIGRATION-COMPLETE.md)
- [Category User Migration Summary](./CATEGORY-USER-MIGRATION-SUMMARY.md)

---

## ✅ Implementation Checklist

- ✅ User entity transformed to Aggregate Root
- ✅ Email and Phone Value Objects integrated
- ✅ CustomerProfile and SellerProfile as child entities
- ✅ Invariants enforced in aggregate root
- ✅ Repository loads/saves complete aggregate
- ✅ Transactional persistence with Prisma
- ✅ CASCADE delete configured in schema
- ✅ CreateUserHandler auto-creates CustomerProfile
- ✅ UpdateUserHandler uses aggregate methods
- ✅ UpgradeToSellerHandler created for role transitions
- ✅ CreateAddressHandler validates through aggregate
- ✅ Dual role support (Customer + Seller)
- ✅ Comprehensive documentation

---

**Implementation Date:** February 6, 2026  
**Status:** ✅ Complete and Production-Ready
