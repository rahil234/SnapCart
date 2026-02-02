# Example DTOs with Proper Swagger Annotations

This document shows well-structured DTOs from the project that can serve as templates.

## Request DTOs

### Query DTO with Pagination

**File:** `apps/api/src/modules/product/interfaces/http/dtos/request/get-products.dto.ts`

```typescript
import { IsOptional, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  CREATED_AT = 'createdAt'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class GetProductsDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for product name or description',
    example: 'cotton shirt'
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by product status',
    example: 'active'
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ProductSortBy,
    example: ProductSortBy.NAME,
    default: ProductSortBy.CREATED_AT
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    example: SortOrder.DESC,
    default: SortOrder.DESC
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
```

### Registration DTO

**File:** `apps/api/src/modules/auth/application/dtos/request/register.dto.ts`

```typescript
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => o.email || !o.phone)
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Phone number', 
    example: '+1234567890' 
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.phone || !o.email)
  phone?: string;

  @ApiProperty({
    description: 'Password (min 6 characters)',
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
```

### Login DTO with Enums

**File:** `apps/api/src/modules/auth/application/dtos/request/login.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateIf, IsIn } from 'class-validator';

import { AuthMethod } from '@/modules/auth/domain/enums';

export class LoginDto {
  @ApiProperty({
    description: 'Email or phone number',
    example: 'user@example.com',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Authentication method (PASSWORD or OTP only)',
    enum: [AuthMethod.PASSWORD, AuthMethod.OTP],
    example: AuthMethod.PASSWORD,
  })
  @IsIn([AuthMethod.PASSWORD, AuthMethod.OTP], {
    message:
      'Method must be PASSWORD or OTP. Use /auth/login/google for Google authentication.',
  })
  method: AuthMethod.PASSWORD | AuthMethod.OTP;

  @ApiPropertyOptional({
    description: 'Password (required for PASSWORD method)',
    example: 'password123',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.PASSWORD)
  password?: string;

  @ApiPropertyOptional({
    description: 'OTP code (required for OTP method)',
    example: '1234',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.method === AuthMethod.OTP)
  otp?: string;
}
```

## Response DTOs

### Product Response DTO

**File:** `apps/api/src/modules/product/interfaces/http/dtos/response/product-response.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Product,
  ProductStatus,
} from '@/modules/product/domain/entities/product.entity';

/**
 * Product Response DTO
 *
 * Represents product identity/catalog information only.
 * For pricing and stock, see VariantResponseDto.
 */
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Basmati Rice',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Premium long-grain basmati rice from Punjab',
  })
  description: string;

  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Brand name',
    example: 'India Gate',
    nullable: true,
  })
  brand: string | null;

  @ApiProperty({
    description: 'Product status (catalog lifecycle)',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether product is active in catalog',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether product is in catalog (not deleted/discontinued)',
    example: true,
  })
  isInCatalog: boolean;

  @ApiProperty({
    description: 'Product creation date',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update date',
    example: '2026-02-01T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.getName(),
      description: product.getDescription(),
      categoryId: product.getCategoryId(),
      brand: product.getBrand(),
      status: product.getStatus(),
      isActive: product.isActive(),
      isInCatalog: product.isInCatalog(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
```

### User Response DTO

**File:** `apps/api/src/modules/user/application/dtos/response/user-response.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '@/modules/user/domain/entities';
import { UserRole, AccountStatus } from '@/modules/user/domain/enums';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
    nullable: true,
  })
  email: string | null;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({ 
    description: 'User role',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({ 
    description: 'Account status',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2026-02-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-02-01T15:30:00.000Z',
  })
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.getId();
    dto.email = user.getEmail();
    dto.phone = user.getPhone();
    dto.role = user.getRole();
    dto.status = user.getStatus();
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
```

## Key Patterns

### 1. Use `@ApiProperty` for Required Fields
```typescript
@ApiProperty({
  description: 'Clear description',
  example: 'Sample value',
})
propertyName: string;
```

### 2. Use `@ApiPropertyOptional` for Optional Fields
```typescript
@ApiPropertyOptional({
  description: 'Clear description',
  example: 'Sample value',
  nullable: true, // If it can be null
})
propertyName?: string | null;
```

### 3. Document Enums Properly
```typescript
@ApiProperty({
  description: 'Status description',
  enum: StatusEnum,
  example: StatusEnum.ACTIVE,
})
status: StatusEnum;
```

### 4. Add Min/Max for Numbers
```typescript
@ApiPropertyOptional({
  description: 'Page size',
  example: 10,
  minimum: 1,
  maximum: 100,
  default: 10,
})
@Min(1)
@Max(100)
limit?: number = 10;
```

### 5. Use Type Transformers for Query Params
```typescript
@ApiPropertyOptional({
  description: 'Page number',
  example: 1,
})
@Type(() => Number)
@IsNumber()
page?: number;
```

### 6. Trim String Inputs
```typescript
@ApiPropertyOptional({
  description: 'Search query',
  example: 'keyword',
})
@Transform(({ value }) => value?.trim())
@IsString()
search?: string;
```

### 7. Conditional Validation
```typescript
@ApiPropertyOptional({
  description: 'Required when method is PASSWORD',
})
@IsString()
@IsOptional()
@ValidateIf((o) => o.method === AuthMethod.PASSWORD)
password?: string;
```

### 8. Factory Methods for Conversion
```typescript
export class ItemResponseDto {
  // ... properties

  static fromDomain(item: Item): ItemResponseDto {
    return {
      id: item.id,
      name: item.getName(),
      createdAt: item.createdAt,
    };
  }
}
```

## Best Practices Checklist

### Request DTOs
- [ ] Use class-validator decorators (`@IsString`, `@IsOptional`, etc.)
- [ ] Add `@ApiProperty` or `@ApiPropertyOptional` to all properties
- [ ] Include examples in Swagger decorators
- [ ] Add description for each property
- [ ] Use `@Type()` for number transformation
- [ ] Use `@Transform()` for string trimming
- [ ] Document enums with `enum` property
- [ ] Add min/max constraints where appropriate
- [ ] Use default values for optional pagination params

### Response DTOs
- [ ] Add `@ApiProperty` to all properties
- [ ] Include realistic examples
- [ ] Add clear descriptions
- [ ] Document enum values
- [ ] Mark nullable fields with `nullable: true`
- [ ] Use `@ApiPropertyOptional` for optional fields
- [ ] Add factory methods for domain/entity conversion
- [ ] Include JSDoc comments for complex DTOs
- [ ] Format dates as ISO strings in examples
- [ ] Use proper TypeScript types

## Common Mistakes to Avoid

❌ **Missing examples**
```typescript
@ApiProperty({ description: 'User name' })
name: string;
```

✅ **With examples**
```typescript
@ApiProperty({
  description: 'User name',
  example: 'John Doe',
})
name: string;
```

---

❌ **Not documenting enums**
```typescript
@ApiProperty()
status: StatusEnum;
```

✅ **Properly documented enums**
```typescript
@ApiProperty({
  description: 'Account status',
  enum: StatusEnum,
  example: StatusEnum.ACTIVE,
})
status: StatusEnum;
```

---

❌ **Missing type transformation**
```typescript
@ApiPropertyOptional()
@IsNumber()
page?: number;
```

✅ **With transformation**
```typescript
@ApiPropertyOptional({ example: 1 })
@Type(() => Number)
@IsNumber()
page?: number;
```

---

## Summary

All DTOs should:
1. Have clear, descriptive property names
2. Include Swagger decorators with examples
3. Use appropriate validators
4. Transform query parameters correctly
5. Document enums and constraints
6. Provide factory methods for response DTOs
7. Follow consistent naming conventions
8. Include realistic example values
