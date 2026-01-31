/*
  Warnings:

  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'blocked', 'suspended', 'deleted');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('Percentage', 'Flat');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('Percentage', 'Flat');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'active';

-- DropEnum
DROP TYPE "public"."UserStatus";

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "CouponType" NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "minAmount" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OfferType" NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "categories" TEXT[],
    "products" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
