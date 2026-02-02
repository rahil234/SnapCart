import * as bcrypt from 'bcrypt';
import { PrismaClient, Prisma } from '@prisma/client';

const email = process.env.SEED_SELLER_EMAIL;
const password = process.env.SEED_SELLER_PASSWORD;

if (!email || !password) {
  throw new Error('Seller seed env vars missing');
}

export const seller = {
  email,
  password,
  phone: null,
  role: 'SELLER',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
} satisfies Prisma.UserCreateManyInput;

export const sellerProfile = {
  storeName: 'Best Seller Store',
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies Omit<Prisma.SellerProfileCreateInput, 'user'>;

export async function seedSeller(prisma: PrismaClient) {
  const user = await prisma.user.upsert({
    create: {
      ...seller,
      password: await bcrypt.hash(seller.password, 10),
    },
    update: {},
    where: { email: seller.email },
  });

  await prisma.sellerProfile.upsert({
    create: { ...sellerProfile, userId: user.id },
    update: {},
    where: { userId: user.id },
  });

  console.log('✅ Seller seeded');
}
