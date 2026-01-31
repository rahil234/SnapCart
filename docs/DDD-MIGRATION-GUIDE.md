# DDD Migration Guide - SnapCart API

## Overview
This guide provides step-by-step instructions to migrate the SnapCart API from its current mixed structure to a clean Domain-Driven Design (DDD) architecture.

---

## Current State Analysis

### Issues with Current Structure
1. **Mixed Concerns**: Auth strategies in `src/auth/` at root level (should be in infrastructure)
2. **Scattered Mappers**: Mappers in `src/product/`, `src/user/`, `src/seller/` at root level
3. **Inconsistent Organization**: Some contexts follow DDD, others don't
4. **Empty Folders**: Many folders like `application/product/use-cases/` are empty
5. **Duplicate Concepts**: Both repository interface and implementation in infrastructure

### What's Working Well
1. ✅ Three-layer separation (domain, application, infrastructure) exists
2. ✅ Module organization per bounded context
3. ✅ CQRS module is imported (ready for command/query pattern)
4. ✅ Prisma repositories use interface-based dependency injection

---

## Migration Plan

### Phase 1: File Reorganization (Non-Breaking)
Move files to correct locations without changing functionality.

### Phase 2: Refactor Domain Layer
Clean up domain entities and remove framework dependencies.

### Phase 3: Implement CQRS
Add commands, queries, and handlers to application layer.

### Phase 4: Clean Up Infrastructure
Consolidate infrastructure concerns and remove duplications.

---

## Phase 1: File Reorganization

### Step 1.1: Move Auth Strategies to Infrastructure

**Current Location**: `src/auth/strategies/`
**Target Location**: `src/infrastructure/auth/strategies/`

```bash
# Create infrastructure auth directory
mkdir -p src/infrastructure/auth/strategies/{jwt,otp,password}

# Move strategies
mv src/auth/strategies/jwt/* src/infrastructure/auth/strategies/jwt/
mv src/auth/strategies/otp/* src/infrastructure/auth/strategies/otp/
mv src/auth/strategies/password/* src/infrastructure/auth/strategies/password/
```

**Files to Move**:
- `src/auth/strategies/jwt/jwt.strategy.ts` → `src/infrastructure/auth/strategies/jwt/`
- `src/auth/strategies/jwt/jwt-strategy.provider.ts` → `src/infrastructure/auth/strategies/jwt/`
- `src/auth/strategies/otp/otp.strategy.ts` → `src/infrastructure/auth/strategies/otp/`
- `src/auth/strategies/otp/otp-strategy.provider.ts` → `src/infrastructure/auth/strategies/otp/`
- `src/auth/strategies/password/password.strategy.ts` → `src/infrastructure/auth/strategies/password/`
- `src/auth/strategies/password/password-strategy.provider.ts` → `src/infrastructure/auth/strategies/password/`

**Update Imports**: After moving, update all import paths in:
- Auth module files
- Controllers that use these strategies
- Any files importing these strategies

### Step 1.2: Move Auth Supporting Files

**Auth Enums**: `src/auth/enums/` → `src/domain/auth/enums/`
**Auth Types**: `src/auth/types/` → `src/domain/auth/types/`
**Auth Utils**: `src/auth/utils/` → `src/infrastructure/auth/utils/`
**Auth Factories**: `src/auth/factories/` → `src/domain/auth/factories/`
**Auth Resolvers**: `src/auth/resolvers/` → `src/infrastructure/auth/resolvers/` (if GraphQL)
**Auth Providers**: `src/auth/providers/` → `src/infrastructure/auth/providers/`

### Step 1.3: Move Product Sub-contexts

**Current**: `src/product/{category,coupon,offer,variant}/`
**Target**: Merge into `src/domain/product/` and related layers

For each sub-context (category, coupon, offer, variant):

```bash
# Option A: Keep as separate bounded contexts
mkdir -p src/domain/category/{entities,repositories,services}
mkdir -p src/application/category/{commands,queries,dtos}
mkdir -p src/infrastructure/category/{persistence,controllers}

# Option B: Keep as part of product aggregate
mkdir -p src/domain/product/entities/{category,coupon,offer,variant}
```

**Recommendation**: Keep **category** as separate bounded context, keep **coupon**, **offer**, **variant** as part of product aggregate.

### Step 1.4: Move Mappers

**Product Mappers**: `src/product/mappers/` → `src/application/product/mappers/` (for domain-DTO)
**Product Mappers**: → `src/infrastructure/product/persistence/mappers/` (for domain-Prisma)
**User Mappers**: `src/user/mappers/` → `src/application/user/mappers/`
**Seller Mappers**: `src/seller/mappers/` → `src/application/seller/mappers/`
**Admin Mappers**: `src/admin/mappers/` → `src/application/admin/mappers/`

### Step 1.5: Move Repository Interfaces

**Current**: Repository interfaces in `src/infrastructure/{context}/repositories/`
**Target**: Move to `src/domain/{context}/repositories/`

```bash
# For each context
mv src/infrastructure/product/repositories/product.repository.ts \
   src/domain/product/repositories/product.repository.interface.ts

# Rename implementation
mv src/infrastructure/product/repositories/prisma-product.repository.ts \
   src/infrastructure/product/persistence/repositories/prisma-product.repository.ts
```

Update the interface file name and keep only the interface definition.

### Step 1.6: Clean Up Empty Root Folders

After moving files, remove empty folders:
```bash
rm -rf src/auth
rm -rf src/product
rm -rf src/user
rm -rf src/seller
rm -rf src/admin
```

---

## Phase 2: Domain Layer Refactoring

### Step 2.1: Enhance Domain Entities

**Before** (Anemic Domain Model):
```typescript
// domain/product/entities/product.entity.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly status: 'active' | 'inactive',
  ) {}
}
```

**After** (Rich Domain Model):
```typescript
// domain/product/entities/product.entity.ts
import { ProductStatus } from '../enums/product-status.enum';
import { Money } from '../value-objects/money.vo';
import { ProductActivatedEvent } from '../events/product-activated.event';

export class Product {
  private domainEvents: any[] = [];

  constructor(
    public readonly id: string,
    private name: string,
    private price: Money,
    private status: ProductStatus,
    private discountPercent: number | null = null,
  ) {}

  // Business logic methods
  activate(): void {
    if (this.status !== ProductStatus.ACTIVE) {
      this.status = ProductStatus.ACTIVE;
      this.addDomainEvent(new ProductActivatedEvent(this.id));
    }
  }

  deactivate(): void {
    this.status = ProductStatus.INACTIVE;
  }

  applyDiscount(percent: number): void {
    if (percent < 0 || percent > 100) {
      throw new Error('Invalid discount percent');
    }
    this.discountPercent = percent;
  }

  getFinalPrice(): Money {
    if (this.discountPercent) {
      return this.price.applyDiscount(this.discountPercent);
    }
    return this.price;
  }

  updatePrice(newPrice: Money): void {
    if (newPrice.isLessThanOrEqual(Money.zero())) {
      throw new Error('Price must be greater than zero');
    }
    this.price = newPrice;
  }

  // Getters
  getName(): string {
    return this.name;
  }

  getPrice(): Money {
    return this.price;
  }

  getStatus(): ProductStatus {
    return this.status;
  }

  isActive(): boolean {
    return this.status === ProductStatus.ACTIVE;
  }

  // Domain events
  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): any[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
```

### Step 2.2: Create Value Objects

```typescript
// domain/product/value-objects/money.vo.ts
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'USD',
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  static of(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  static zero(): Money {
    return new Money(0);
  }

  getValue(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  applyDiscount(percent: number): Money {
    const discountAmount = this.amount * (percent / 100);
    return new Money(this.amount - discountAmount, this.currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount <= other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Cannot operate on different currencies');
    }
  }
}
```

```typescript
// domain/user/value-objects/email.vo.ts
export class Email {
  private constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  static of(value: string): Email {
    return new Email(value.toLowerCase().trim());
  }

  getValue(): string {
    return this.value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### Step 2.3: Create Domain Enums

```typescript
// domain/product/enums/product-status.enum.ts
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SERVICE = 'SERVICE',
}
```

### Step 2.4: Create Domain Events

```typescript
// domain/product/events/product-activated.event.ts
export class ProductActivatedEvent {
  constructor(
    public readonly productId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

// domain/product/events/product-created.event.ts
export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
```

### Step 2.5: Create Domain Services

```typescript
// domain/product/services/product-pricing.service.ts
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { Money } from '../value-objects/money.vo';

@Injectable()
export class ProductPricingService {
  calculateBulkDiscount(products: Product[], quantity: number): Money {
    let total = Money.zero();
    
    products.forEach(product => {
      total = total.add(product.getFinalPrice());
    });

    // Apply bulk discount logic
    if (quantity >= 10) {
      return total.applyDiscount(10); // 10% discount
    } else if (quantity >= 5) {
      return total.applyDiscount(5); // 5% discount
    }

    return total;
  }

  canApplyDiscount(product: Product, discountPercent: number): boolean {
    // Business rule: Cannot discount more than 70%
    return discountPercent <= 70 && product.isActive();
  }
}
```

---

## Phase 3: Application Layer (CQRS)

### Step 3.1: Create Commands

```typescript
// application/product/commands/create-product.command.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoryId: string,
    public readonly tryOn: boolean = false,
  ) {}
}

// application/product/commands/update-product-price.command.ts
export class UpdateProductPriceCommand {
  constructor(
    public readonly productId: string,
    public readonly newPrice: number,
  ) {}
}

// application/product/commands/activate-product.command.ts
export class ActivateProductCommand {
  constructor(public readonly productId: string) {}
}
```

### Step 3.2: Create Command Handlers

```typescript
// application/product/commands/handlers/create-product.handler.ts
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command';
import { Product } from '@/domain/product/entities/product.entity';
import { ProductRepository } from '@/domain/product/repositories/product.repository.interface';
import { Money } from '@/domain/product/value-objects/money.vo';
import { ProductStatus } from '@/domain/product/enums/product-status.enum';
import { v4 as uuid } from 'uuid';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    // Create domain entity
    const product = new Product(
      uuid(),
      command.name,
      Money.of(command.price),
      ProductStatus.ACTIVE,
    );

    // Save via repository
    const savedProduct = await this.productRepository.save(product);

    // Publish domain events
    product.getDomainEvents().forEach(event => {
      this.eventBus.publish(event);
    });
    product.clearDomainEvents();

    return savedProduct;
  }
}
```

```typescript
// application/product/commands/handlers/activate-product.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ActivateProductCommand } from '../activate-product.command';
import { ProductRepository } from '@/domain/product/repositories/product.repository.interface';

@CommandHandler(ActivateProductCommand)
export class ActivateProductHandler implements ICommandHandler<ActivateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: ActivateProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.productId);
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.activate();
    await this.productRepository.save(product);
  }
}
```

### Step 3.3: Create Queries

```typescript
// application/product/queries/get-product-by-id.query.ts
export class GetProductByIdQuery {
  constructor(public readonly productId: string) {}
}

// application/product/queries/list-products.query.ts
export class ListProductsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly categoryId?: string,
    public readonly status?: string,
  ) {}
}
```

### Step 3.4: Create Query Handlers

```typescript
// application/product/queries/handlers/get-product-by-id.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProductByIdQuery } from '../get-product-by-id.query';
import { ProductRepository } from '@/domain/product/repositories/product.repository.interface';
import { Product } from '@/domain/product/entities/product.entity';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    const product = await this.productRepository.findById(query.productId);
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
```

### Step 3.5: Create DTOs

```typescript
// application/product/dtos/request/create-product.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  tryOn?: boolean;
}

// application/product/dtos/response/product.dto.ts
export class ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  discountPercent: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 3.6: Create Mappers

```typescript
// application/product/mappers/product.mapper.ts
import { Product } from '@/domain/product/entities/product.entity';
import { ProductDto } from '../dtos/response/product.dto';
import { CreateProductDto } from '../dtos/request/create-product.dto';
import { CreateProductCommand } from '../commands/create-product.command';

export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.getName(),
      description: '', // Add description to entity
      price: product.getPrice().getValue(),
      finalPrice: product.getFinalPrice().getValue(),
      discountPercent: null, // Add to entity
      status: product.getStatus(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toCommand(dto: CreateProductDto): CreateProductCommand {
    return new CreateProductCommand(
      dto.name,
      dto.description,
      dto.price,
      dto.categoryId,
      dto.tryOn,
    );
  }
}
```

### Step 3.7: Update Application Module

```typescript
// application/product/product.application.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductDomainModule } from '@/domain/product/product.domain.module';
import { ProductInfrastructureModule } from '@/infrastructure/product/product.infrastructure.module';

// Command Handlers
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { ActivateProductHandler } from './commands/handlers/activate-product.handler';

// Query Handlers
import { GetProductByIdHandler } from './queries/handlers/get-product-by-id.handler';
import { ListProductsHandler } from './queries/handlers/list-products.handler';

const CommandHandlers = [CreateProductHandler, ActivateProductHandler];
const QueryHandlers = [GetProductByIdHandler, ListProductsHandler];

@Module({
  imports: [
    CqrsModule,
    ProductDomainModule,
    ProductInfrastructureModule,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [],
})
export class ProductApplicationModule {}
```

---

## Phase 4: Infrastructure Layer

### Step 4.1: Update Controllers to Use CQRS

```typescript
// infrastructure/product/controllers/product.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from '@/application/product/dtos/request/create-product.dto';
import { ProductDto } from '@/application/product/dtos/response/product.dto';
import { ProductMapper } from '@/application/product/mappers/product.mapper';
import { CreateProductCommand } from '@/application/product/commands/create-product.command';
import { GetProductByIdQuery } from '@/application/product/queries/get-product-by-id.query';
import { ActivateProductCommand } from '@/application/product/commands/activate-product.command';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    const command = ProductMapper.toCommand(dto);
    const product = await this.commandBus.execute(command);
    return ProductMapper.toDto(product);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductDto> {
    const query = new GetProductByIdQuery(id);
    const product = await this.queryBus.execute(query);
    return ProductMapper.toDto(product);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string): Promise<void> {
    const command = new ActivateProductCommand(id);
    await this.commandBus.execute(command);
  }
}
```

### Step 4.2: Create Persistence Mappers

```typescript
// infrastructure/product/persistence/mappers/product-persistence.mapper.ts
import { Product } from '@/domain/product/entities/product.entity';
import { Money } from '@/domain/product/value-objects/money.vo';
import { ProductStatus } from '@/domain/product/enums/product-status.enum';
import { Product as PrismaProduct } from '@prisma/client';

export class ProductPersistenceMapper {
  static toDomain(prisma: PrismaProduct): Product {
    return new Product(
      prisma.id,
      prisma.name,
      Money.of(prisma.price),
      prisma.status as ProductStatus,
      prisma.discountPercent,
    );
  }

  static toPrisma(product: Product): any {
    return {
      id: product.id,
      name: product.getName(),
      price: product.getPrice().getValue(),
      status: product.getStatus(),
      // Add other fields
    };
  }
}
```

### Step 4.3: Update Repository Implementation

```typescript
// infrastructure/product/persistence/repositories/prisma-product.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ProductRepository } from '@/domain/product/repositories/product.repository.interface';
import { Product } from '@/domain/product/entities/product.entity';
import { ProductPersistenceMapper } from '../mappers/product-persistence.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const data = ProductPersistenceMapper.toPrisma(product);
    
    const result = await this.prisma.product.upsert({
      where: { id: product.id },
      update: data,
      create: data,
    });

    return ProductPersistenceMapper.toDomain(result);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.prisma.product.findUnique({
      where: { id },
    });

    return result ? ProductPersistenceMapper.toDomain(result) : null;
  }

  async findAll(filters: any): Promise<Product[]> {
    const results = await this.prisma.product.findMany({
      where: filters,
    });

    return results.map(ProductPersistenceMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
```

### Step 4.4: Update Infrastructure Module

```typescript
// infrastructure/product/product.infrastructure.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { PrismaProductRepository } from './persistence/repositories/prisma-product.repository';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductInfrastructureModule {}
```

---

## Migration Checklist

### Phase 1: File Organization
- [ ] Move auth strategies to infrastructure
- [ ] Move auth supporting files to appropriate layers
- [ ] Move product sub-contexts
- [ ] Move mappers to correct layers
- [ ] Move repository interfaces to domain
- [ ] Clean up empty root folders
- [ ] Update all import paths

### Phase 2: Domain Layer
- [ ] Convert entities to rich domain models
- [ ] Create value objects (Money, Email, etc.)
- [ ] Create domain enums
- [ ] Create domain events
- [ ] Create domain services
- [ ] Move repository interfaces to domain
- [ ] Remove framework dependencies from domain

### Phase 3: Application Layer
- [ ] Create commands
- [ ] Create command handlers
- [ ] Create queries
- [ ] Create query handlers
- [ ] Create DTOs
- [ ] Create application mappers
- [ ] Update application modules
- [ ] Register handlers in modules

### Phase 4: Infrastructure Layer
- [ ] Update controllers to use CQRS
- [ ] Create persistence mappers
- [ ] Update repository implementations
- [ ] Update infrastructure modules
- [ ] Move strategies to infrastructure
- [ ] Create adapters for external services

### Testing
- [ ] Update unit tests for domain entities
- [ ] Add tests for command handlers
- [ ] Add tests for query handlers
- [ ] Update integration tests for controllers
- [ ] Test repository implementations

### Documentation
- [ ] Update README with new structure
- [ ] Document bounded contexts
- [ ] Document command/query patterns
- [ ] Add architecture diagrams

---

## Common Pitfalls & Solutions

### Pitfall 1: Circular Dependencies
**Problem**: Domain depends on application or infrastructure
**Solution**: Use dependency inversion - domain defines interfaces, infrastructure implements

### Pitfall 2: Fat Controllers
**Problem**: Business logic in controllers
**Solution**: Move logic to command/query handlers

### Pitfall 3: Anemic Domain Models
**Problem**: Entities are just data bags
**Solution**: Add business methods to entities

### Pitfall 4: Tight Coupling to Prisma
**Problem**: Prisma types leak into domain
**Solution**: Use mappers to convert between layers

### Pitfall 5: Mixed Concerns in Modules
**Problem**: Domain, application, and infrastructure in same module
**Solution**: Separate into three distinct modules per context

---

## Verification Steps

After migration, verify:

1. **Domain Layer is Pure**
```bash
# No NestJS or Prisma imports in domain
grep -r "@nestjs" src/domain/
grep -r "@prisma" src/domain/
# Should return nothing
```

2. **Proper Layer Dependencies**
```bash
# Domain shouldn't import from application or infrastructure
grep -r "from '@/application" src/domain/
grep -r "from '@/infrastructure" src/domain/
# Should return nothing
```

3. **All Tests Pass**
```bash
npm run test
npm run test:e2e
```

4. **Build Succeeds**
```bash
npm run build
```

---

## Timeline Estimate

- **Phase 1 (File Organization)**: 2-3 days
- **Phase 2 (Domain Refactoring)**: 1 week
- **Phase 3 (CQRS Implementation)**: 1-2 weeks
- **Phase 4 (Infrastructure Cleanup)**: 1 week
- **Testing & Bug Fixes**: 1 week

**Total**: 4-6 weeks for complete migration

---

## Getting Help

If you encounter issues during migration:
1. Review the DDD-FOLDER-STRUCTURE.md document
2. Check the examples in this guide
3. Look at successfully migrated contexts as reference
4. Create a backup branch before major changes

---

## Next Steps

1. Start with Phase 1 (file organization) - it's non-breaking
2. Pick one small bounded context (e.g., "category") for Phase 2-4 as a pilot
3. Once the pilot is successful, repeat for other contexts
4. Gradually migrate all contexts

Good luck with your migration! 🚀
