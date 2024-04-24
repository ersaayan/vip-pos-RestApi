/*
  Warnings:

  - You are about to drop the column `ProductIds` on the `StockKart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockKartId" TEXT;

-- AlterTable
ALTER TABLE "StockKart" DROP COLUMN "ProductIds";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockKartId_fkey" FOREIGN KEY ("stockKartId") REFERENCES "StockKart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
