-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "PhoneBrandModelName" TEXT NOT NULL,
    "PhoneBrandModelStockCode" TEXT NOT NULL,
    "PhoneBrandName" TEXT NOT NULL,
    "PhoneModelGroupCode" TEXT NOT NULL,
    "Description" TEXT,
    "Barcode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockKart" (
    "id" TEXT NOT NULL,
    "CaseBrand" TEXT NOT NULL,
    "CaseModelImage" TEXT NOT NULL,
    "CaseModelVariations" TEXT[],
    "CaseModelTitle" TEXT NOT NULL,
    "ProductIds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockKart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
