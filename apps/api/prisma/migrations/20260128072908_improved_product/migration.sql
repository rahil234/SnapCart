/*
  Warnings:

  - You are about to drop the column `productId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercent` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tryOn` on the `Product` table. All the data in the column will be lost.
  - Added the required column `finalPrice` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountPercent",
DROP COLUMN "finalPrice",
DROP COLUMN "price",
DROP COLUMN "tryOn";

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "discountPercent" DOUBLE PRECISION,
ADD COLUMN     "finalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
