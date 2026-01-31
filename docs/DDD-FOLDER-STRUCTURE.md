# Domain-Driven Design (DDD) Folder Structure for SnapCart

## Overview
This document defines the finalized DDD folder structure for the SnapCart API. The architecture follows a clean, layered approach with clear separation of concerns across Domain, Application, and Infrastructure layers.

## Core Principles

1. **Domain Layer**: Contains business logic, entities, value objects, domain services, and domain events
2. **Application Layer**: Contains use cases, DTOs, commands, queries, and application services
3. **Infrastructure Layer**: Contains implementation details (repositories, controllers, external services)
4. **Common/Shared**: Cross-cutting concerns used across all layers

---

## Folder Structure

```
src/
├── main.ts                           # Application entry point
├── app.module.ts                      # Root module
│
├── domain/                            # DOMAIN LAYER (Business Logic)
│   ├── {bounded-context}/             # e.g., product, order, user, cart, etc.
│   │   ├── entities/                  # Domain entities (rich domain models)
│   │   │   ├── {entity}.entity.ts
│   │   │   └── index.ts
│   │   ├── value-objects/             # Value objects (immutable)
│   │   │   ├── {value-object}.vo.ts
│   │   │   └── index.ts
│   │   ├── aggregates/                # Aggregate roots (optional)
│   │   │   ├── {aggregate}.aggregate.ts
│   │   │   └── index.ts
│   │   ├── repositories/              # Repository interfaces (contracts)
│   │   │   ├── {entity}.repository.interface.ts
│   │   │   └── index.ts
│   │   ├── services/                  # Domain services (complex business logic)
│   │   │   ├── {service}.service.ts
│   │   │   └── index.ts
│   │   ├── events/                    # Domain events
│   │   │   ├── {event}.event.ts
│   │   │   └── index.ts
│   │   ├── specifications/            # Business rules/specifications (optional)
│   │   │   ├── {specification}.spec.ts
│   │   │   └── index.ts
│   │   ├── exceptions/                # Domain-specific exceptions
│   │   │   ├── {exception}.exception.ts
│   │   │   └── index.ts
│   │   ├── enums/                     # Domain enums
│   │   │   └── index.ts
│   │   └── {context}.domain.module.ts # Domain module
│   │
│   └── shared/                        # Shared domain concepts
│       ├── base-entity.ts
│       ├── base-aggregate-root.ts
│       └── domain-event.base.ts
│
├── application/                       # APPLICATION LAYER (Use Cases)
│   ├── {bounded-context}/             # e.g., product, order, user, cart, etc.
│   │   ├── commands/                  # Write operations (CQRS)
│   │   │   ├── handlers/
│   │   │   │   ├── {command}.handler.ts
│   │   │   │   └── index.ts
│   │   │   ├── {command}.command.ts
│   │   │   └── index.ts
│   │   ├── queries/                   # Read operations (CQRS)
│   │   │   ├── handlers/
│   │   │   │   ├── {query}.handler.ts
│   │   │   │   └── index.ts
│   │   │   ├── {query}.query.ts
│   │   │   └── index.ts
│   │   ├── dtos/                      # Data Transfer Objects
│   │   │   ├── request/
│   │   │   │   └── {dto}.dto.ts
│   │   │   ├── response/
│   │   │   │   └── {dto}.dto.ts
│   │   │   └── index.ts
│   │   ├── use-cases/                 # Alternative to CQRS (if not using commands/queries)
│   │   │   ├── {use-case}.use-case.ts
│   │   │   └── index.ts
│   │   ├── mappers/                   # Domain <-> DTO mappers
│   │   │   ├── {mapper}.mapper.ts
│   │   │   └── index.ts
│   │   ├── services/                  # Application services (orchestration)
│   │   │   ├── {service}.service.ts
│   │   │   └── index.ts
│   │   ├── ports/                     # Input/Output ports (interfaces)
│   │   │   ├── input/
│   │   │   │   └── {port}.port.ts
│   │   │   └── output/
│   │   │       └── {port}.port.ts
│   │   └── {context}.application.module.ts
│   │
│   └── shared/                        # Shared application concerns
│       └── base-command.handler.ts
│
├── infrastructure/                    # INFRASTRUCTURE LAYER (Implementation)
│   ├── {bounded-context}/             # e.g., product, order, user, cart, etc.
│   │   ├── persistence/               # Data persistence
│   │   │   ├── repositories/          # Repository implementations
│   │   │   │   ├── {entity}.repository.ts
│   │   │   │   └── index.ts
│   │   │   ├── mappers/               # Prisma <-> Domain mappers
│   │   │   │   ├── {mapper}.mapper.ts
│   │   │   │   └── index.ts
│   │   │   └── schemas/               # Prisma schemas (if split)
│   │   │       └── {schema}.prisma
│   │   ├── controllers/               # HTTP controllers (API endpoints)
│   │   │   ├── {controller}.controller.ts
│   │   │   └── index.ts
│   │   ├── graphql/                   # GraphQL resolvers (if using GraphQL)
│   │   │   ├── resolvers/
│   │   │   └── schemas/
│   │   ├── adapters/                  # External service adapters
│   │   │   ├── {adapter}.adapter.ts
│   │   │   └── index.ts
│   │   ├── strategies/                # Strategy implementations (e.g., auth)
│   │   │   └── {strategy}.strategy.ts
│   │   └── {context}.infrastructure.module.ts
│   │
│   └── shared/                        # Shared infrastructure
│       ├── database/
│       ├── messaging/
│       └── external-services/
│
├── common/                            # SHARED KERNEL (Cross-cutting concerns)
│   ├── config/                        # Configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── index.ts
│   ├── decorators/                    # Custom decorators
│   │   ├── {decorator}.decorator.ts
│   │   └── index.ts
│   ├── guards/                        # Guards (auth, roles, etc.)
│   │   ├── {guard}.guard.ts
│   │   └── index.ts
│   ├── interceptors/                  # Interceptors
│   │   ├── {interceptor}.interceptor.ts
│   │   └── index.ts
│   ├── filters/                       # Exception filters
│   │   ├── {filter}.filter.ts
│   │   └── index.ts
│   ├── middleware/                    # Middleware
│   │   ├── {middleware}.middleware.ts
│   │   └── index.ts
│   ├── pipes/                         # Validation pipes
│   │   ├── {pipe}.pipe.ts
│   │   └── index.ts
│   ├── dto/                           # Shared DTOs
│   │   ├── pagination.dto.ts
│   │   └── index.ts
│   ├── enums/                         # Shared enums
│   │   └── index.ts
│   ├── types/                         # Shared types
│   │   └── index.ts
│   ├── utils/                         # Utility functions
│   │   ├── {util}.util.ts
│   │   └── index.ts
│   ├── exceptions/                    # Base exceptions
│   │   └── base.exception.ts
│   ├── logger/                        # Logging service
│   │   ├── logger.service.ts
│   │   └── logger.module.ts
│   ├── prisma/                        # Prisma service
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── redis/                         # Redis service
│   │   ├── redis.service.ts
│   │   └── redis.module.ts
│   ├── jwt/                           # JWT service
│   │   ├── jwt.service.ts
│   │   └── jwt.module.ts
│   ├── storage/                       # Storage service (S3, local, etc.)
│   │   ├── storage.service.ts
│   │   └── storage.module.ts
│   └── shared.module.ts               # Common module
│
└── prisma/                            # Prisma configuration
    ├── schema.prisma                  # Database schema
    ├── seed.ts                        # Database seeding
    └── migrations/                    # Database migrations
```

---

## Bounded Contexts (Modules)

Based on your current project, here are the identified bounded contexts:

### Core Contexts
- **product** - Product catalog, variants, categories, offers, coupons
- **order** - Order management, order processing
- **cart** - Shopping cart management
- **payment** - Payment processing
- **user** - User management, profiles
- **auth** - Authentication, authorization
- **seller** - Seller management, seller products
- **wallet** - Wallet management, transactions

### Supporting Contexts
- **media** - Media upload, storage
- **otp** - OTP generation, verification
- **sms** - SMS sending
- **email** - Email sending
- **analytics** - Analytics, tracking
- **webhook** - Webhook handling
- **landing-page** - Landing page management
- **admin** - Admin operations
- **ai** - AI features (try-on, etc.)

---

## Layer Responsibilities

### 1. Domain Layer
**Purpose**: Pure business logic, independent of frameworks and external concerns

**Contents**:
- **Entities**: Core business objects with identity (e.g., Product, Order, User)
- **Value Objects**: Immutable objects defined by their values (e.g., Money, Address, Email)
- **Aggregates**: Cluster of entities and value objects with clear boundaries
- **Repository Interfaces**: Contracts for data persistence (no implementation)
- **Domain Services**: Business logic that doesn't fit in entities
- **Domain Events**: Events that occur in the domain
- **Specifications**: Business rules encapsulation

**Rules**:
- ✅ NO external dependencies (no Prisma, no NestJS decorators)
- ✅ NO infrastructure concerns
- ✅ Pure TypeScript/JavaScript
- ✅ Should be testable in isolation

**Example**:
```typescript
// domain/product/entities/product.entity.ts
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: Money,
    public readonly status: ProductStatus,
  ) {}

  activate(): void {
    if (this.status === ProductStatus.INACTIVE) {
      this.status = ProductStatus.ACTIVE;
    }
  }

  applyDiscount(percent: number): Money {
    return this.price.discount(percent);
  }
}
```

---

### 2. Application Layer
**Purpose**: Use cases, orchestration, business workflows

**Contents**:
- **Commands**: Write operations (CreateProduct, UpdateOrder)
- **Queries**: Read operations (GetProductById, ListOrders)
- **Command Handlers**: Execute commands
- **Query Handlers**: Execute queries
- **DTOs**: Data transfer between layers
- **Mappers**: Transform between domain and DTOs
- **Application Services**: Orchestrate multiple domain services

**Rules**:
- ✅ Can depend on Domain layer
- ✅ Should use repository interfaces (not implementations)
- ✅ Orchestrates domain logic
- ❌ NO direct database access
- ❌ NO HTTP/REST concerns

**Example**:
```typescript
// application/product/commands/create-product.command.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly categoryId: string,
  ) {}
}

// application/product/commands/handlers/create-product.handler.ts
@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = new Product(
      uuid(),
      command.name,
      new Money(command.price),
      ProductStatus.ACTIVE,
    );
    
    return await this.productRepository.save(product);
  }
}
```

---

### 3. Infrastructure Layer
**Purpose**: Implementation details, external systems, frameworks

**Contents**:
- **Repository Implementations**: Actual database access using Prisma
- **Controllers**: HTTP REST endpoints
- **GraphQL Resolvers**: GraphQL endpoints (if using GraphQL)
- **Adapters**: External service integrations (Stripe, AWS S3, SendGrid)
- **Mappers**: Transform between Prisma models and domain entities
- **Strategies**: Authentication strategies (JWT, OAuth, OTP)

**Rules**:
- ✅ Can depend on Domain and Application layers
- ✅ Implements interfaces from Domain/Application
- ✅ Framework-specific code here (NestJS, Prisma, etc.)
- ✅ External integrations

**Example**:
```typescript
// infrastructure/product/persistence/repositories/product.repository.ts
@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);
    const result = await this.prisma.product.create({ data });
    return ProductMapper.toDomain(result);
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.prisma.product.findUnique({ where: { id } });
    return result ? ProductMapper.toDomain(result) : null;
  }
}

// infrastructure/product/controllers/product.controller.ts
@Controller('products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const command = new CreateProductCommand(dto.name, dto.price, dto.categoryId);
    return await this.commandBus.execute(command);
  }
}
```

---

## Module Organization

Each bounded context should have three modules:

```typescript
// domain/product/product.domain.module.ts
@Module({
  providers: [ProductService, /* domain services */],
  exports: [ProductService],
})
export class ProductDomainModule {}

// application/product/product.application.module.ts
@Module({
  imports: [
    CqrsModule,
    ProductDomainModule,
    ProductInfrastructureModule,
  ],
  controllers: [ProductController],
  providers: [
    /* command handlers */
    /* query handlers */
  ],
})
export class ProductApplicationModule {}

// infrastructure/product/product.infrastructure.module.ts
@Module({
  imports: [PrismaModule],
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

## Migration Strategy

To migrate your current structure to this DDD structure:

### Phase 1: Consolidate Scattered Files
- Move `src/product/*` subfolders into proper layers
- Move `src/auth/*` to `infrastructure/auth/strategies/`
- Move `src/user/mappers/` to appropriate layer
- Move `src/seller/mappers/` to appropriate layer

### Phase 2: Refactor Domain Layer
- Extract business logic from services into domain entities
- Create value objects for complex types (Money, Email, Address)
- Define repository interfaces in domain layer
- Remove framework dependencies from domain entities

### Phase 3: Refactor Application Layer
- Implement CQRS pattern (commands/queries)
- Move DTOs from various places to application/dtos
- Create proper mappers between layers
- Implement use cases as command/query handlers

### Phase 4: Refactor Infrastructure Layer
- Move repository implementations to infrastructure/persistence
- Keep controllers in infrastructure
- Move external service integrations to infrastructure/adapters

---

## Best Practices

### 1. Naming Conventions
- **Entities**: `{Entity}.entity.ts` (e.g., `product.entity.ts`)
- **Value Objects**: `{ValueObject}.vo.ts` (e.g., `money.vo.ts`)
- **Commands**: `{Action}{Entity}.command.ts` (e.g., `create-product.command.ts`)
- **Queries**: `get-{entity}.query.ts` or `list-{entities}.query.ts`
- **Handlers**: `{Command/Query}.handler.ts`
- **DTOs**: `{action}-{entity}.dto.ts`
- **Repositories**: `{entity}.repository.ts` (interface) and `prisma-{entity}.repository.ts` (implementation)

### 2. Dependency Direction
```
Infrastructure → Application → Domain
       ↓              ↓
    Common  ←  ←  ←  ←
```

- Domain should have NO dependencies
- Application depends only on Domain
- Infrastructure depends on both
- Common is used by all layers

### 3. Testing Strategy
- **Domain**: Unit tests (pure logic, no mocks)
- **Application**: Unit tests with mocked repositories
- **Infrastructure**: Integration tests (with real database/services)

### 4. File Size
- Keep files small and focused (< 200 lines)
- Single responsibility principle
- One class per file

### 5. Exports
- Always use index.ts for clean imports
- Export only public interfaces/classes

---

## Common Patterns

### Repository Pattern
```typescript
// Domain: Interface
export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}

// Infrastructure: Implementation
@Injectable()
export class PrismaProductRepository implements ProductRepository {
  // implementation
}
```

### CQRS Pattern
```typescript
// Command (write)
export class CreateProductCommand {
  constructor(public readonly name: string) {}
}

// Query (read)
export class GetProductByIdQuery {
  constructor(public readonly id: string) {}
}
```

### Mapper Pattern
```typescript
// Application: Domain ↔ DTO
export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return { id: product.id, name: product.name };
  }
  
  static toDomain(dto: CreateProductDto): Product {
    return new Product(uuid(), dto.name);
  }
}

// Infrastructure: Prisma ↔ Domain
export class ProductPersistenceMapper {
  static toPrisma(product: Product): Prisma.ProductCreateInput {
    return { name: product.name, price: product.price.value };
  }
  
  static toDomain(prisma: PrismaProduct): Product {
    return new Product(prisma.id, prisma.name);
  }
}
```

---

## Examples by Context

### Product Context Structure
```
domain/product/
  ├── entities/
  │   ├── product.entity.ts
  │   └── index.ts
  ├── value-objects/
  │   ├── money.vo.ts
  │   └── index.ts
  ├── repositories/
  │   ├── product.repository.interface.ts
  │   └── index.ts
  ├── services/
  │   ├── product-pricing.service.ts
  │   └── index.ts
  └── product.domain.module.ts

application/product/
  ├── commands/
  │   ├── handlers/
  │   │   ├── create-product.handler.ts
  │   │   └── index.ts
  │   ├── create-product.command.ts
  │   └── index.ts
  ├── queries/
  │   ├── handlers/
  │   │   ├── get-product.handler.ts
  │   │   └── index.ts
  │   ├── get-product.query.ts
  │   └── index.ts
  ├── dtos/
  │   ├── request/
  │   │   └── create-product.dto.ts
  │   ├── response/
  │   │   └── product.dto.ts
  │   └── index.ts
  └── product.application.module.ts

infrastructure/product/
  ├── persistence/
  │   ├── repositories/
  │   │   ├── prisma-product.repository.ts
  │   │   └── index.ts
  │   └── mappers/
  │       └── product-persistence.mapper.ts
  ├── controllers/
  │   ├── product.controller.ts
  │   └── index.ts
  └── product.infrastructure.module.ts
```

### Auth Context Structure
```
domain/auth/
  ├── entities/
  │   ├── session.entity.ts
  │   └── index.ts
  ├── value-objects/
  │   ├── token.vo.ts
  │   └── index.ts
  ├── services/
  │   ├── auth.service.ts
  │   └── index.ts
  └── auth.domain.module.ts

application/auth/
  ├── commands/
  │   ├── handlers/
  │   │   ├── login.handler.ts
  │   │   ├── register.handler.ts
  │   │   └── index.ts
  │   ├── login.command.ts
  │   └── index.ts
  ├── dtos/
  │   ├── request/
  │   │   ├── login.dto.ts
  │   │   └── register.dto.ts
  │   └── response/
  │       └── auth-response.dto.ts
  └── auth.application.module.ts

infrastructure/auth/
  ├── strategies/
  │   ├── jwt/
  │   │   ├── jwt.strategy.ts
  │   │   └── jwt-strategy.provider.ts
  │   ├── otp/
  │   │   ├── otp.strategy.ts
  │   │   └── otp-strategy.provider.ts
  │   └── password/
  │       ├── password.strategy.ts
  │       └── password-strategy.provider.ts
  ├── controllers/
  │   ├── auth.controller.ts
  │   └── index.ts
  └── auth.infrastructure.module.ts
```

---

## Tools & Utilities

### Generating New Bounded Context
You can create a script to scaffold new contexts:

```bash
# scripts/create-context.sh
#!/bin/bash
CONTEXT=$1

# Create domain structure
mkdir -p src/domain/$CONTEXT/{entities,value-objects,repositories,services,events}

# Create application structure
mkdir -p src/application/$CONTEXT/{commands/handlers,queries/handlers,dtos/{request,response}}

# Create infrastructure structure
mkdir -p src/infrastructure/$CONTEXT/{persistence/{repositories,mappers},controllers}

# Create module files
touch src/domain/$CONTEXT/$CONTEXT.domain.module.ts
touch src/application/$CONTEXT/$CONTEXT.application.module.ts
touch src/infrastructure/$CONTEXT/$CONTEXT.infrastructure.module.ts
```

---

## Conclusion

This DDD structure provides:
- ✅ Clear separation of concerns
- ✅ Testable, maintainable code
- ✅ Scalable architecture
- ✅ Independent modules
- ✅ Framework-agnostic domain logic
- ✅ Flexibility to change infrastructure without affecting business logic

Follow this structure consistently across all bounded contexts for a clean, maintainable codebase.
