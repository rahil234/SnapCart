/*
  Warnings:

  - The values [out_of_stock] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `discountPercent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,variantId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantName` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VariantStatus" AS ENUM ('active', 'inactive', 'out_of_stock');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('active', 'inactive', 'discontinued');
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountPercent",
DROP COLUMN "price",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "finalPrice",
DROP COLUMN "size",
ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sellerProfileId" TEXT,
ADD COLUMN     "sku" TEXT NOT NULL,
ADD COLUMN     "status" "VariantStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "variantName" TEXT NOT NULL,
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "discountPercent" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_variantId_idx" ON "CartItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_variantId_key" ON "CartItem"("cartId", "variantId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_sellerProfileId_idx" ON "ProductVariant"("sellerProfileId");

-- CreateIndex
CREATE INDEX "ProductVariant_status_idx" ON "ProductVariant"("status");

-- CreateIndex
CREATE INDEX "ProductVariant_isActive_idx" ON "ProductVariant"("isActive");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
