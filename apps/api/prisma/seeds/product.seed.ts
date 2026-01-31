import { PrismaClient, Prisma } from '@prisma/client';
import { categories } from './category.seed';
import { sellerProfile } from './seller.seed';

export const products = [
  {
    name: 'Milk Chocolate Bar',
    description: 'Delicious milk chocolate made from the finest cocoa beans.',
    price: 19.99,
    status: 'active',
    categoryId: categories.find((cat) => cat.name === 'Grocery Items')?.id!,
    discountPercent: 10,
    sellerProfileId: sellerProfile.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows.',
    price: 4.99,
    status: 'active',
    categoryId: categories.find((cat) => cat.name === 'Dairy Products')?.id!,
    discountPercent: 5,
    sellerProfileId: sellerProfile.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water with a hint of natural flavor.',
    price: 1.99,
    status: 'active',
    categoryId: categories.find((cat) => cat.name === 'Cool Drinks')?.id!,
    discountPercent: 0,
    sellerProfileId: sellerProfile.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] satisfies Prisma.ProductCreateManyInput[];

export async function seedProducts(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('✅ Products seeded');
}
