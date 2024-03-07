/*
  Warnings:

  - You are about to drop the column `OrderId` on the `OrderAddress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `OrderAddress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `OrderAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderAddress" DROP CONSTRAINT "OrderAddress_OrderId_fkey";

-- DropIndex
DROP INDEX "OrderAddress_OrderId_key";

-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "OrderId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrderAddress_orderId_key" ON "OrderAddress"("orderId");

-- AddForeignKey
ALTER TABLE "OrderAddress" ADD CONSTRAINT "OrderAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
