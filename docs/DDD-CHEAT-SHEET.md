# DDD Cheat Sheet - One Page Reference

## 🏗️ Folder Structure (Simplified)

```
src/
├── domain/{context}/
│   ├── entities/              # Business objects with identity
│   ├── value-objects/         # Immutable values (Money, Email)
│   ├── repositories/          # Repository INTERFACES only
│   ├── services/              # Domain services
│   ├── events/                # Domain events
│   └── {context}.domain.module.ts
│
├── application/{context}/
│   ├── commands/handlers/     # Write operations
│   ├── queries/handlers/      # Read operations
│   ├── dtos/request/          # Input DTOs
│   ├── dtos/response/         # Output DTOs
│   ├── mappers/               # Domain ↔ DTO
│   └── {context}.application.module.ts
│
└── infrastructure/{context}/
    ├── persistence/
    │   ├── repositories/      # Repository IMPLEMENTATIONS
    │   └── mappers/           # Prisma ↔ Domain
    ├── controllers/           # REST endpoints
    └── {context}.infrastructure.module.ts
```

---

## 🎯 Layer Rules

| Layer | Can Import | Cannot Import | Purpose |
|-------|-----------|---------------|---------|
| **Domain** | Nothing | Application, Infrastructure | Pure business logic |
| **Application** | Domain | Infrastructure | Use cases, orchestration |
| **Infrastructure** | Domain, Application | Nothing | Framework, DB, APIs |

---

## 📝 Quick Templates

### Domain Entity
```typescript
// domain/product/entities/product.entity.ts
export class Product {
  private constructor(
    public readonly id: string,
    private name: string,
    private price: Money,
  ) {}

  static create(name: string, price: Money): Product {
    return new Product(uuid(), name, price);
  }

  activate(): void {
    // Business logic
  }

  getName(): string { return this.name; }
}
```

### Value Object
```typescript
// domain/product/value-objects/money.vo.ts
export class Money {
  private constructor(private readonly amount: number) {
    if (amount < 0) throw new Error('Invalid amount');
  }
  
  static of(amount: number): Money {
    return new Money(amount);
  }
  
  getValue(): number { return this.amount; }
}
```

### Repository Interface
```typescript
// domain/product/repositories/product.repository.interface.ts
export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}
```

### Command
```typescript
// application/product/commands/create-product.command.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
  ) {}
}
```

### Command Handler
```typescript
// application/product/commands/handlers/create-product.handler.ts
@CommandHandler(CreateProductCommand)
export class CreateProductHandler {
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

### Controller
```typescript
// infrastructure/product/controllers/product.controller.ts
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ProductDto> {
    const command = new CreateProductCommand(dto.name, dto.price);
    const product = await this.commandBus.execute(command);
    return ProductMapper.toDto(product);
  }
}
```

### Repository Implementation
```typescript
// infrastructure/product/persistence/repositories/prisma-product.repository.ts
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
}
```

---

## 🔄 Request Flow

```
Client → Controller → CommandBus → Handler → Entity → Repository → Database
  ↓         ↓           ↓            ↓         ↓         ↓
 JSON      DTO      Command      Business   Domain   Prisma     PostgreSQL
                                 Logic      Model    Model
```

---

## 📦 Module Setup

```typescript
// domain/product/product.domain.module.ts
@Module({
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductDomainModule {}

// application/product/product.application.module.ts
@Module({
  imports: [CqrsModule, ProductDomainModule, ProductInfrastructureModule],
  providers: [CreateProductHandler, GetProductHandler],
})
export class ProductApplicationModule {}

// infrastructure/product/product.infrastructure.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
  ],
  exports: ['ProductRepository'],
})
export class ProductInfrastructureModule {}
```

---

## 🎨 Naming Conventions

```
Entity:                 product.entity.ts
Value Object:           money.vo.ts
Repository Interface:   product.repository.interface.ts
Repository Impl:        prisma-product.repository.ts
Command:                create-product.command.ts
Query:                  get-product-by-id.query.ts
Handler:                create-product.handler.ts
DTO:                    create-product.dto.ts
Controller:             product.controller.ts
Domain Module:          product.domain.module.ts
Application Module:     product.application.module.ts
Infrastructure Module:  product.infrastructure.module.ts
```

---

## ✅ Quick Checklist

**Creating New Feature:**
- [ ] Create entity in domain
- [ ] Create repository interface in domain
- [ ] Create command/query in application
- [ ] Create handler in application
- [ ] Create DTOs in application
- [ ] Create controller in infrastructure
- [ ] Create repository impl in infrastructure
- [ ] Register handler in module
- [ ] Write tests

**Code Review:**
- [ ] No @nestjs imports in domain
- [ ] No business logic in controllers
- [ ] Handlers use repository interfaces
- [ ] DTOs have validation
- [ ] Tests written

---

## 🚀 Create New Context

```bash
CONTEXT="new-context"

# Create directories
mkdir -p src/domain/$CONTEXT/{entities,value-objects,repositories,services,events}
mkdir -p src/application/$CONTEXT/{commands/handlers,queries/handlers,dtos/{request,response},mappers}
mkdir -p src/infrastructure/$CONTEXT/{persistence/{repositories,mappers},controllers}

# Create modules
touch src/domain/$CONTEXT/$CONTEXT.domain.module.ts
touch src/application/$CONTEXT/$CONTEXT.application.module.ts
touch src/infrastructure/$CONTEXT/$CONTEXT.infrastructure.module.ts
```

---

## 🔍 Verify Structure

```bash
# Check domain purity
grep -r "@nestjs" src/domain/     # Should return nothing
grep -r "@prisma" src/domain/     # Should return nothing

# Check dependencies
grep -r "from '@/infrastructure" src/domain/      # Should return nothing
grep -r "from '@/application" src/domain/         # Should return nothing

# Run tests
npm run test

# Build
npm run build
```

---

## 🎯 Key Principles

1. **Domain is Pure** - No framework dependencies
2. **Application Orchestrates** - Uses domain entities
3. **Infrastructure Implements** - Technical details
4. **Dependencies Flow Down** - Infra → App → Domain
5. **CQRS for Clarity** - Separate read/write
6. **Rich Domain Models** - Business logic in entities
7. **Value Objects for Validation** - Immutable types
8. **Repository Pattern** - Abstract persistence

---

## 📚 Full Documentation

- **Complete Guide**: `docs/DDD-FOLDER-STRUCTURE.md`
- **Migration Plan**: `docs/DDD-MIGRATION-GUIDE.md`
- **Quick Reference**: `docs/DDD-QUICK-REFERENCE.md`
- **Architecture Diagrams**: `docs/DDD-ARCHITECTURE-DIAGRAMS.md`
- **Summary**: `docs/README.md`

---

**Print this page and keep it handy!** 📄✨
