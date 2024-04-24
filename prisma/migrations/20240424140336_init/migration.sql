/*
  Warnings:

  - You are about to drop the column `stockKartId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_stockKartId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stockKartId";

-- AlterTable
ALTER TABLE "StockKart" ADD COLUMN     "ProductIds" TEXT[];
