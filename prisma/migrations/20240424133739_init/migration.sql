/*
  Warnings:

  - The `ProductIds` column on the `StockKart` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StockKart" DROP COLUMN "ProductIds",
ADD COLUMN     "ProductIds" TEXT[];
