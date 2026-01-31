import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, Prisma } from '@prisma/client';

export const categories = [
  {
    id: uuidv4(),
    name: 'Dairy Products',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Grocery Items',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Cool Drinks',
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
