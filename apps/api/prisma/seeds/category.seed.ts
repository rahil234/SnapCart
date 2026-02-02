import { PrismaClient, Prisma } from '@prisma/client';

export const categories = [
  {
    name: 'Candies & Sweets' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Dairy Products' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Grocery Items' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Cool Drinks' as const,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] satisfies Prisma.CategoryCreateManyInput[];

export async function seedCategories(prisma: PrismaClient) {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log('✅ Categories seeded');
}
