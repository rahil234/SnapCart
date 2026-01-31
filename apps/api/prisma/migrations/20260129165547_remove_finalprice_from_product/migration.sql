/*
  Warnings:

  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPercent" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tryOn" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
