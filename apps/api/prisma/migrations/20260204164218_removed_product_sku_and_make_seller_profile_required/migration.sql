/*
  Warnings:

  - You are about to drop the column `sku` on the `ProductVariant` table. All the data in the column will be lost.
  - Made the column `sellerProfileId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellerProfileId` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_sellerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductVariant" DROP CONSTRAINT "ProductVariant_sellerProfileId_fkey";

-- DropIndex
DROP INDEX "public"."ProductVariant_sku_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "sellerProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "sku",
ALTER COLUMN "sellerProfileId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
