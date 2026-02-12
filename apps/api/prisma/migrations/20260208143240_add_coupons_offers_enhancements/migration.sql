/*
  Warnings:

  - The `status` column on the `Coupon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Offer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `minAmount` on table `Coupon` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('active', 'inactive', 'expired');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('active', 'inactive', 'expired');

-- CreateEnum
CREATE TYPE "Applicability" AS ENUM ('all', 'specific_products', 'specific_categories');

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "applicableTo" "Applicability" NOT NULL DEFAULT 'all',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isStackable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxUsagePerUser" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "usageLimit" INTEGER,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "minAmount" SET NOT NULL,
ALTER COLUMN "minAmount" SET DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "CouponStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isStackable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxDiscount" DOUBLE PRECISION,
ADD COLUMN     "minPurchaseAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "OfferStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "appliedCouponCode" TEXT,
ADD COLUMN     "appliedOfferIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "couponDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "offerDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CouponUsage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "discountApplied" DOUBLE PRECISION NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CouponUsage_couponId_idx" ON "CouponUsage"("couponId");

-- CreateIndex
CREATE INDEX "CouponUsage_userId_idx" ON "CouponUsage"("userId");

-- CreateIndex
CREATE INDEX "CouponUsage_orderId_idx" ON "CouponUsage"("orderId");

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
