/*
  Warnings:

  - Made the column `stockKartId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_stockKartId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "stockKartId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockKartId_fkey" FOREIGN KEY ("stockKartId") REFERENCES "StockKart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
