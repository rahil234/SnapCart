# Product-Variant Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from the old Product-centric model to the new Product (Identity) + ProductVariant (Sellable Unit) architecture.

## Step 1: Run Prisma Migration

```bash
cd apps/api
npx prisma migrate dev --name refactor_product_variant_architecture
```

This will:
- Remove `price`, `discountPercent`, `sellerProfileId` from Product
- Add proper ProductVariant table with all commerce fields
- Update CartItem to only reference ProductVariant

## Step 2: Data Migration Script

Create and run this migration script:

```typescript
// apps/api/prisma/migrate-products-to-variants.ts

import { PrismaClient, ProductStatus, VariantStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateProductsToVariants() {
  console.log('Starting migration...\n');

  const products = await prisma.product.findMany({
    include: {
      sellerProfile: true,
    },
  });

  console.log(`Found ${products.length} products to migrate\n`);

  for (const product of products) {
    try {
      // Generate default SKU
      const sku = `DEFAULT-${product.id.slice(0, 8).toUpperCase()}`;

      // Map old status to new variant status
      let variantStatus: VariantStatus;
      let isActive = true;

      if (product.status === 'out_of_stock') {
        variantStatus = 'out_of_stock';
        isActive = false;
      } else if (product.status === 'active') {
        variantStatus = 'active';
        isActive = true;
      } else {
        variantStatus = 'inactive';
        isActive = false;
      }

      // Create default variant
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: sku,
          variantName: 'Default',
          price: product.price,
          discountPercent: product.discountPercent || 0,
          stock: 100, // Default stock - adjust as needed
          status: variantStatus,
          isActive: isActive,
          isDeleted: false,
          sellerProfileId: product.sellerProfileId,
          attributes: null,
          imageUrl: null,
        },
      });

      console.log(`✓ Migrated product ${product.id} → variant ${sku}`);
    } catch (error) {
      console.error(`✗ Failed to migrate product ${product.id}:`, error);
    }
  }

  console.log('\n✓ Product migration complete!');
}

async function migrateCartItems() {
  console.log('\nMigrating cart items...\n');

  const cartItems = await prisma.cartItem.findMany();

  console.log(`Found ${cartItems.length} cart items to migrate\n`);

  for (const item of cartItems) {
    try {
      // Find the default variant for this product
      const variant = await prisma.productVariant.findFirst({
        where: {
          productId: item.productId,
          sku: { startsWith: 'DEFAULT-' },
        },
      });

      if (variant) {
        // Update cart item to reference variant only
        await prisma.cartItem.update({
          where: { id: item.id },
          data: {
            variantId: variant.id,
          },
        });

        console.log(`✓ Migrated cart item ${item.id} → variant ${variant.id}`);
      } else {
        console.warn(`⚠ No variant found for cart item ${item.id} (product: ${item.productId})`);
      }
    } catch (error) {
      console.error(`✗ Failed to migrate cart item ${item.id}:`, error);
    }
  }

  console.log('\n✓ Cart items migration complete!');
}

async function updateProductStatuses() {
  console.log('\nUpdating product statuses...\n');

  // Map discontinued products
  await prisma.product.updateMany({
    where: { status: 'discontinued' as any },
    data: { status: 'discontinued' as ProductStatus },
  });

  // Map out_of_stock to inactive (product level doesn't have out_of_stock)
  await prisma.product.updateMany({
    where: { status: 'out_of_stock' as any },
    data: { status: 'inactive' as ProductStatus },
  });

  console.log('✓ Product statuses updated!');
}

async function main() {
  try {
    await migrateProductsToVariants();
    await migrateCartItems();
    await updateProductStatuses();

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Run the migration:

```bash
npx ts-node prisma/migrate-products-to-variants.ts
```

## Step 3: Verify Migration

```typescript
// apps/api/prisma/verify-migration.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  // Check all products have at least one variant
  const productsWithoutVariants = await prisma.product.findMany({
    where: {
      variants: {
        none: {},
      },
    },
  });

  console.log(`Products without variants: ${productsWithoutVariants.length}`);
  if (productsWithoutVariants.length > 0) {
    console.log('IDs:', productsWithoutVariants.map(p => p.id));
  }

  // Check all cart items reference valid variants
  const cartItemsWithInvalidVariants = await prisma.cartItem.findMany({
    where: {
      variant: null,
    },
  });

  console.log(`Cart items with invalid variants: ${cartItemsWithInvalidVariants.length}`);

  // Check for duplicate SKUs
  const skus = await prisma.productVariant.groupBy({
    by: ['sku'],
    _count: true,
    having: {
      sku: {
        _count: {
          gt: 1,
        },
      },
    },
  });

  console.log(`Duplicate SKUs: ${skus.length}`);

  if (productsWithoutVariants.length === 0 && 
      cartItemsWithInvalidVariants.length === 0 && 
      skus.length === 0) {
    console.log('\n✅ Migration verification passed!');
  } else {
    console.log('\n⚠️  Migration verification found issues!');
  }

  await prisma.$disconnect();
}

verify();
```

Run verification:

```bash
npx ts-node prisma/verify-migration.ts
```

## Step 4: Update Domain Events

Update the Product events:

```typescript
// apps/api/src/modules/product/domain/events/product.events.ts

export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly categoryId: string,
    // Removed: price (now in variant)
  ) {}
}

export class ProductUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly changes: {
      name?: string;
      description?: string;
      brand?: string | null;
      categoryId?: string;
      status?: string;
      // Removed: price, discountPercent (now in variant)
    },
  ) {}
}
```

Create new Variant events:

```typescript
// apps/api/src/modules/product/domain/events/variant.events.ts

export class VariantCreatedEvent {
  constructor(
    public readonly variantId: string,
    public readonly productId: string,
    public readonly sku: string,
    public readonly price: number,
  ) {}
}

export class VariantUpdatedEvent {
  constructor(
    public readonly variantId: string,
    public readonly changes: {
      price?: number;
      discountPercent?: number;
      stock?: number;
      status?: string;
    },
  ) {}
}

export class VariantStockUpdatedEvent {
  constructor(
    public readonly variantId: string,
    public readonly previousStock: number,
    public readonly newStock: number,
  ) {}
}
```

## Step 5: Update Queries

Create new queries for variants:

```typescript
// apps/api/src/modules/product/application/queries/get-variants-by-product.query.ts

export class GetVariantsByProductQuery {
  constructor(
    public readonly productId: string,
    public readonly includeInactive: boolean = false,
  ) {}
}
```

```typescript
// apps/api/src/modules/product/application/queries/get-variant-by-id.query.ts

export class GetVariantByIdQuery {
  constructor(
    public readonly variantId: string,
  ) {}
}
```

```typescript
// apps/api/src/modules/product/application/queries/get-product-with-variants.query.ts

export class GetProductWithVariantsQuery {
  constructor(
    public readonly productId: string,
  ) {}
}
```

## Step 6: Update Controller

The controller file needs to be updated to handle both Product and Variant endpoints. Here's the structure:

```typescript
// Product endpoints
POST   /api/admin/products
PATCH  /api/admin/products/:id
GET    /api/admin/products/:id
GET    /api/admin/products

// Variant endpoints
POST   /api/admin/products/:productId/variants
PATCH  /api/admin/products/variants/:variantId
PATCH  /api/admin/products/variants/:variantId/stock
GET    /api/admin/products/:productId/variants
GET    /api/admin/products/variants/:variantId
DELETE /api/admin/products/variants/:variantId
```

## Step 7: Update Tests

Update your tests to reflect the new architecture:

```typescript
describe('Product Creation', () => {
  it('should create product without price', async () => {
    const result = await commandBus.execute(
      new CreateProductCommand(
        'Basmati Rice',
        'Premium rice',
        'cat_123',
        'India Gate',
      )
    );

    expect(result.getName()).toBe('Basmati Rice');
    // No price on product anymore
  });

  it('should create variant with price', async () => {
    const variant = await commandBus.execute(
      new CreateVariantCommand(
        'prod_123',
        'BAS-1KG-001',
        '1kg',
        120.00,
        100,
      )
    );

    expect(variant.getPrice()).toBe(120.00);
    expect(variant.calculateFinalPrice()).toBe(120.00);
  });
});
```

## Step 8: Deployment Checklist

### Pre-Deployment
- [ ] Backup production database
- [ ] Test migration on staging environment
- [ ] Verify all tests pass
- [ ] Update API documentation
- [ ] Communicate changes to frontend team

### Deployment
- [ ] Deploy database migration
- [ ] Run data migration script
- [ ] Verify migration with verification script
- [ ] Deploy new backend code
- [ ] Monitor error logs

### Post-Deployment
- [ ] Verify cart functionality
- [ ] Verify checkout flow
- [ ] Verify product creation/editing
- [ ] Check admin panel works correctly
- [ ] Monitor performance metrics

## Rollback Plan

If issues arise, rollback procedure:

1. Revert application code deployment
2. Restore database from backup
3. Investigate issues
4. Fix and re-test on staging
5. Re-deploy when ready

## Common Issues & Solutions

### Issue: Cart items show "variant not found"

**Solution**: Some cart items weren't migrated. Run:

```sql
DELETE FROM "CartItem" WHERE "variantId" IS NULL;
```

### Issue: Duplicate SKUs

**Solution**: Fix duplicate SKUs manually:

```sql
UPDATE "ProductVariant" 
SET "sku" = "sku" || '-' || id 
WHERE "sku" IN (
  SELECT "sku" 
  FROM "ProductVariant" 
  GROUP BY "sku" 
  HAVING COUNT(*) > 1
);
```

### Issue: Products without variants

**Solution**: Create default variants for orphaned products:

```bash
npx ts-node prisma/create-missing-variants.ts
```

## Next Steps

After successful migration:

1. Monitor application for 1 week
2. Remove old commented code
3. Update frontend to use variant endpoints
4. Consider adding bulk variant operations
5. Implement variant search/filtering
6. Add variant inventory alerts

## Support

For issues or questions:
- Check error logs in production
- Review migration verification output
- Contact backend team lead
