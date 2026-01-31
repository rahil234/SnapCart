import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, Prisma } from '@prisma/client';

const email = process.env.SEED_SELLER_EMAIL;
const password = process.env.SEED_SELLER_PASSWORD;

if (!email || !password) {
  throw new Error('Seller seed env vars missing');
}

export const seller = {
  id: uuidv4(),
  email,
  password,
  phone: null,
  role: 'SELLER',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
} satisfies Prisma.UserCreateManyInput;

export const sellerProfile = {
  id: uuidv4(),
  storeName: 'Best Seller Store',
  user: {
    create: seller,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies Prisma.SellerProfileCreateInput;

export async function seedSeller(prisma: PrismaClient) {
  await prisma.sellerProfile.create({
    data: sellerProfile,
  });

  console.log('✅ Seller seeded');
}
