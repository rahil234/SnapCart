/*
  Warnings:

  - You are about to drop the column `userId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerProfileId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Made the column `customerProfileId` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `customerProfileId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_customerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomerProfile" DROP CONSTRAINT "CustomerProfile_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "public"."Cart_userId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "userId",
ALTER COLUMN "customerProfileId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "userId",
ADD COLUMN     "customerProfileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerProfile" DROP COLUMN "cartId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerProfileId_key" ON "Cart"("customerProfileId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
