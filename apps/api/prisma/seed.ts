import { PrismaClient } from '@prisma/client';

import { seedAdmin } from './seeds/admin.seed';
import { seedSeller } from './seeds/seller.seed';
import { seedCategories } from './seeds/category.seed';
import { seedProducts } from './seeds/product.seed';

const prisma = new PrismaClient();

async function main() {
  await seedAdmin(prisma);
  await seedSeller(prisma);
  await seedCategories(prisma);
  await seedProducts(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
