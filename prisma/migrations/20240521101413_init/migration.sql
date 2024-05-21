-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MANUFACTURER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "roles" "Role"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ikasGroupCode" TEXT,
    "myorGroupCode" TEXT,
    "stockCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseBrand" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "myorGroupCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseModelVariation" (
    "id" TEXT NOT NULL,
    "modelVariation" TEXT NOT NULL,
    "modelVariationEng" TEXT NOT NULL,
    "myorGroupCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseModelVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCart" (
    "id" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "caseBrand" TEXT NOT NULL,
    "caseModelVariation" TEXT NOT NULL,
    "caseImage" TEXT,
    "title" TEXT,
    "description" TEXT,
    "barcode" TEXT,
    "cost" DOUBLE PRECISION,
    "satisFiyat1" DOUBLE PRECISION,
    "satisFiyat2" DOUBLE PRECISION,
    "satisFiyat3" DOUBLE PRECISION,
    "satisFiyat4" DOUBLE PRECISION,
    "quantity" INTEGER,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCartHistory" (
    "id" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "caseBrand" TEXT NOT NULL,
    "caseModelVariation" TEXT NOT NULL,
    "caseImage" TEXT,
    "title" TEXT,
    "description" TEXT,
    "barcode" TEXT,
    "cost" DOUBLE PRECISION,
    "satisFiyat1" DOUBLE PRECISION,
    "satisFiyat2" DOUBLE PRECISION,
    "satisFiyat3" DOUBLE PRECISION,
    "satisFiyat4" DOUBLE PRECISION,
    "quantity" INTEGER,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockCartHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformOrderVerification" (
    "id" TEXT NOT NULL,
    "kargoTakipNo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformOrderVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderCost" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stockCart" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFiles" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "StockCart" ADD CONSTRAINT "StockCart_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCart" ADD CONSTRAINT "StockCart_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCart" ADD CONSTRAINT "StockCart_caseBrand_fkey" FOREIGN KEY ("caseBrand") REFERENCES "CaseBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCart" ADD CONSTRAINT "StockCart_caseModelVariation_fkey" FOREIGN KEY ("caseModelVariation") REFERENCES "CaseModelVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCartHistory" ADD CONSTRAINT "StockCartHistory_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCartHistory" ADD CONSTRAINT "StockCartHistory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCartHistory" ADD CONSTRAINT "StockCartHistory_caseBrand_fkey" FOREIGN KEY ("caseBrand") REFERENCES "CaseBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCartHistory" ADD CONSTRAINT "StockCartHistory_caseModelVariation_fkey" FOREIGN KEY ("caseModelVariation") REFERENCES "CaseModelVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformOrderVerification" ADD CONSTRAINT "PlatformOrderVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_stockCart_fkey" FOREIGN KEY ("stockCart") REFERENCES "StockCart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFiles" ADD CONSTRAINT "OrderFiles_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
