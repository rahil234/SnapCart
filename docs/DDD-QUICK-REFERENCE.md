# DDD Quick Reference - SnapCart

## Folder Structure Template

```
src/
├── domain/{context}/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/           # Interfaces only
│   ├── services/
│   ├── events/
│   ├── enums/
│   ├── exceptions/
│   └── {context}.domain.module.ts
│
├── application/{context}/
│   ├── commands/
│   │   ├── handlers/
│   │   └── {command}.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   └── {query}.query.ts
│   ├── dtos/
│   │   ├── request/
│   │   └── response/
│   ├── mappers/                # Domain ↔ DTO
│   └── {context}.application.module.ts
│
└── infrastructure/{context}/
    ├── persistence/
    │   ├── repositories/       # Implementations
    │   └── mappers/           # Prisma ↔ Domain
    ├── controllers/
    ├── strategies/
    └── {context}.infrastructure.module.ts
```

---

## Quick Commands

### Create New Bounded Context
```bash
# Create directory structure
CONTEXT="your-context-name"

mkdir -p src/domain/$CONTEXT/{entities,value-objects,repositories,services,events,enums,exceptions}
mkdir -p src/application/$CONTEXT/{commands/handlers,queries/handlers,dtos/{request,response},mappers}
mkdir -p src/infrastructure/$CONTEXT/{persistence/{repositories,mappers},controllers}

# Create module files
touch src/domain/$CONTEXT/$CONTEXT.domain.module.ts
touch src/application/$CONTEXT/$CONTEXT.application.module.ts
touch src/infrastructure/$CONTEXT/$CONTEXT.infrastructure.module.ts
```

---

## File Templates

### 1. Domain Entity
```typescript
// domain/{context}/entities/{entity}.entity.ts
export class Product {
  private constructor(
    public readonly id: string,
    private name: string,
    private price: Money,
    private status: ProductStatus,
  ) {}

  // Factory method
  static create(name: string, price: Money): Product {
    return new Product(uuid(), name, price, ProductStatus.ACTIVE);
  }

  // Business methods
  activate(): void {
    this.status = ProductStatus.ACTIVE;
  }

  // Getters
  getName(): string {
    return this.name;
  }
}
```

### 2. Value Object
```typescript
// domain/{context}/value-objects/{vo}.vo.ts
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string = 'USD',
  ) {
    if (amount < 0) throw new Error('Invalid amount');
  }

  static of(amount: number): Money {
    return new Money(amount);
  }

  getValue(): number {
    return this.amount;
  }
}
```

### 3. Repository Interface
```typescript
// domain/{context}/repositories/{entity}.repository.interface.ts
export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(filters: any): Promise<Product[]>;
  delete(id: string): Promise<void>;
}
```

### 4. Domain Service
```typescript
// domain/{context}/services/{service}.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductPricingService {
  calculateFinalPrice(product: Product, discount: number): Money {
    return product.getPrice().applyDiscount(discount);
  }
}
```

### 5. Domain Event
```typescript
// domain/{context}/events/{event}.event.ts
export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
```

### 6. Command
```typescript
// application/{context}/commands/{command}.command.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
  ) {}
}
```

### 7. Command Handler
```typescript
// application/{context}/commands/handlers/{command}.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly repository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = Product.create(command.name, Money.of(command.price));
    return await this.repository.save(product);
  }
}
```

### 8. Query
```typescript
// application/{context}/queries/{query}.query.ts
export class GetProductByIdQuery {
  constructor(public readonly productId: string) {}
}
```

### 9. Query Handler
```typescript
// application/{context}/queries/handlers/{query}.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly repository: ProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<Product> {
    return await this.repository.findById(query.productId);
  }
}
```

### 10. DTO
```typescript
// application/{context}/dtos/request/{dto}.dto.ts
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}

// application/{context}/dtos/response/{dto}.dto.ts
export class ProductDto {
  id: string;
  name: string;
  price: number;
}
```

### 11. Application Mapper
```typescript
// application/{context}/mappers/{mapper}.mapper.ts
export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.getName(),
      price: product.getPrice().getValue(),
    };
  }

  static toCommand(dto: CreateProductDto): CreateProductCommand {
    return new CreateProductCommand(dto.name, dto.price);
  }
}
```

### 12. Controller
```typescript
// infrastructure/{context}/controllers/{controller}.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

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
}
```

### 13. Repository Implementation
```typescript
// infrastructure/{context}/persistence/repositories/{entity}.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

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
    const result = await this.prisma.product.findUnique({ where: { id } });
    return result ? ProductPersistenceMapper.toDomain(result) : null;
  }
}
```

### 14. Persistence Mapper
```typescript
// infrastructure/{context}/persistence/mappers/{mapper}.mapper.ts
import { Product as PrismaProduct } from '@prisma/client';

export class ProductPersistenceMapper {
  static toDomain(prisma: PrismaProduct): Product {
    return new Product(
      prisma.id,
      prisma.name,
      Money.of(prisma.price),
      prisma.status as ProductStatus,
    );
  }

  static toPrisma(product: Product): any {
    return {
      id: product.id,
      name: product.getName(),
      price: product.getPrice().getValue(),
      status: product.getStatus(),
    };
  }
}
```

### 15. Domain Module
```typescript
// domain/{context}/{context}.domain.module.ts
import { Module } from '@nestjs/common';

@Module({
  providers: [ProductPricingService],
  exports: [ProductPricingService],
})
export class ProductDomainModule {}
```

### 16. Application Module
```typescript
// application/{context}/{context}.application.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const CommandHandlers = [CreateProductHandler];
const QueryHandlers = [GetProductByIdHandler];

@Module({
  imports: [
    CqrsModule,
    ProductDomainModule,
    ProductInfrastructureModule,
  ],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ProductApplicationModule {}
```

### 17. Infrastructure Module
```typescript
// infrastructure/{context}/{context}.infrastructure.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';

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

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Entity | `{Entity}.entity.ts` | `product.entity.ts` |
| Value Object | `{ValueObject}.vo.ts` | `money.vo.ts` |
| Repository Interface | `{entity}.repository.interface.ts` | `product.repository.interface.ts` |
| Repository Impl | `prisma-{entity}.repository.ts` | `prisma-product.repository.ts` |
| Domain Service | `{service}.service.ts` | `product-pricing.service.ts` |
| Event | `{event}.event.ts` | `product-created.event.ts` |
| Command | `{action}-{entity}.command.ts` | `create-product.command.ts` |
| Query | `get-{entity}.query.ts` | `get-product-by-id.query.ts` |
| Handler | `{command/query}.handler.ts` | `create-product.handler.ts` |
| DTO | `{action}-{entity}.dto.ts` | `create-product.dto.ts` |
| Mapper | `{entity}.mapper.ts` | `product.mapper.ts` |
| Controller | `{entity}.controller.ts` | `product.controller.ts` |
| Module | `{context}.{layer}.module.ts` | `product.domain.module.ts` |

---

## Common Patterns

### Factory Pattern (Entity Creation)
```typescript
export class Product {
  static create(name: string, price: Money): Product {
    return new Product(uuid(), name, price, ProductStatus.ACTIVE);
  }
}
```

### Specification Pattern (Business Rules)
```typescript
export class ProductCanBeDiscountedSpec {
  isSatisfiedBy(product: Product, discount: number): boolean {
    return product.isActive() && discount <= 70;
  }
}
```

### Repository Pattern
```typescript
// Domain: Interface
export interface ProductRepository {
  save(product: Product): Promise<Product>;
}

// Infrastructure: Implementation
export class PrismaProductRepository implements ProductRepository {
  async save(product: Product): Promise<Product> {
    // Prisma logic
  }
}
```

### CQRS Pattern
```typescript
// Write: Command
export class CreateProductCommand { }

// Read: Query
export class GetProductByIdQuery { }
```

---

## Dependencies Rules

```
✅ ALLOWED:
Infrastructure → Application → Domain
Infrastructure → Domain
Application → Domain
Common → (any layer can use)

❌ FORBIDDEN:
Domain → Application
Domain → Infrastructure
Application → Infrastructure (except via interfaces)
```

---

## Testing Patterns

### Domain Entity Test
```typescript
describe('Product', () => {
  it('should activate product', () => {
    const product = Product.create('Test', Money.of(100));
    product.deactivate();
    product.activate();
    expect(product.isActive()).toBe(true);
  });
});
```

### Command Handler Test
```typescript
describe('CreateProductHandler', () => {
  it('should create product', async () => {
    const repository = mock<ProductRepository>();
    const handler = new CreateProductHandler(repository);
    const command = new CreateProductCommand('Test', 100);
    
    await handler.execute(command);
    
    expect(repository.save).toHaveBeenCalled();
  });
});
```

---

## Common Imports

```typescript
// Domain (minimal imports)
// No @nestjs imports allowed!
import { v4 as uuid } from 'uuid';

// Application
import { CommandHandler, QueryHandler, ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';

// Infrastructure
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PrismaService } from '@/common/prisma/prisma.service';

// Validation
import { IsString, IsNumber, IsEmail, IsOptional, Min, Max } from 'class-validator';
```

---

## Checklist for New Feature

- [ ] Create domain entity
- [ ] Create value objects (if needed)
- [ ] Create repository interface in domain
- [ ] Create domain service (if needed)
- [ ] Create command/query
- [ ] Create command/query handler
- [ ] Create DTOs
- [ ] Create application mapper
- [ ] Create controller
- [ ] Create repository implementation
- [ ] Create persistence mapper
- [ ] Register handlers in module
- [ ] Register repository in infrastructure module
- [ ] Write tests
- [ ] Update API documentation

---

## VS Code Snippets

Add to `.vscode/snippets.code-snippets`:

```json
{
  "DDD Entity": {
    "prefix": "ddd-entity",
    "body": [
      "export class ${1:Entity} {",
      "  private constructor(",
      "    public readonly id: string,",
      "    private ${2:field}: ${3:type},",
      "  ) {}",
      "",
      "  static create(${2:field}: ${3:type}): ${1:Entity} {",
      "    return new ${1:Entity}(uuid(), ${2:field});",
      "  }",
      "",
      "  get${2/(.*)/${1:/capitalize}/}(): ${3:type} {",
      "    return this.${2:field};",
      "  }",
      "}"
    ]
  },
  "DDD Command": {
    "prefix": "ddd-command",
    "body": [
      "export class ${1:Action}${2:Entity}Command {",
      "  constructor(",
      "    public readonly ${3:field}: ${4:type},",
      "  ) {}",
      "}"
    ]
  },
  "DDD Command Handler": {
    "prefix": "ddd-handler",
    "body": [
      "import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';",
      "import { Inject } from '@nestjs/common';",
      "",
      "@CommandHandler(${1:Command})",
      "export class ${1:Command}Handler implements ICommandHandler<${1:Command}> {",
      "  constructor(",
      "    @Inject('${2:Repository}')",
      "    private readonly repository: ${2:Repository},",
      "  ) {}",
      "",
      "  async execute(command: ${1:Command}): Promise<${3:ReturnType}> {",
      "    $0",
      "  }",
      "}"
    ]
  }
}
```

---

## Useful Commands

```bash
# Find domain layer violations (should return nothing)
grep -r "@nestjs" src/domain/
grep -r "@prisma" src/domain/

# Count files by layer
find src/domain -type f | wc -l
find src/application -type f | wc -l
find src/infrastructure -type f | wc -l

# Find all command handlers
find src/application -name "*.handler.ts" -path "*/commands/*"

# Find all query handlers
find src/application -name "*.handler.ts" -path "*/queries/*"

# List all bounded contexts
ls -1 src/domain/
```

---

## Resources

- Full Documentation: `docs/DDD-FOLDER-STRUCTURE.md`
- Migration Guide: `docs/DDD-MIGRATION-GUIDE.md`
- This Quick Reference: `docs/DDD-QUICK-REFERENCE.md`
