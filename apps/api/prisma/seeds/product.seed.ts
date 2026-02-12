import { PrismaClient } from '@prisma/client';

export const products = [
  {
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows.',
    categoryName: 'Dairy Products',
    status: 'active',
    variants: [
      {
        variantName: '500 ml',
        stock: 40,
        price: 35,
      },
      {
        variantName: '1 L',
        stock: 60,
        price: 65,
      },
      {
        variantName: '2 L',
        stock: 30,
        price: 120,
      },
    ],
  },

  // 🔹 Product with 2 variants
  {
    name: 'Sparkling Water',
    description: 'Refreshing sparkling water with natural flavors.',
    categoryName: 'Cool Drinks',
    status: 'active',
    variants: [
      {
        variantName: 'Lemon – 500 ml',
        stock: 100,
        price: 30,
      },
      {
        variantName: 'Mint – 500 ml',
        stock: 80,
        price: 30,
      },
    ],
  },

  // 🔹 Product with 1 variant
  {
    name: 'Milk Chocolate Bar',
    description: 'Classic milk chocolate made from premium cocoa.',
    categoryName: 'Candies & Sweets',
    status: 'active',
    variants: [
      {
        variantName: '40 g',
        stock: 150,
        price: 45,
      },
    ],
  },
];

export async function seedProducts(prisma: PrismaClient) {
  const sellerProfile = await prisma.sellerProfile.findFirst({
    where: { storeName: 'Best Seller Store' },
  });

  for (const product of products) {
    const category = await prisma.category.findFirst({
      where: { name: product.categoryName },
    });

    if (!category) {
      throw new Error(`Category not found for product: ${product.name}`);
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        status: product.status as 'active' | 'inactive',
        category: { connect: { id: category.id } },
        sellerProfile: { connect: { id: sellerProfile.id } },
      },
    });

    // 2️⃣ Create Variants (sellable units)
    await prisma.productVariant.createMany({
      data: product.variants.map((variant) => ({
        productId: createdProduct.id,
        variantName: variant.variantName,
        stock: variant.stock,
        sellerProfileId: sellerProfile.id,
        price: variant.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
  }

  console.log('✅ Products with 1 / 2 / 3 variants seeded successfully');
}
