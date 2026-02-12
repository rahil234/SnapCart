/*
  Warnings:

  - You are about to drop the column `customerProfileId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `customerProfileId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Address" DROP CONSTRAINT "Address_customerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerProfileId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "customerProfileId",
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerProfileId",
ADD COLUMN     "customerId" TEXT;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
