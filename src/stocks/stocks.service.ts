import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createWriteStream } from 'fs';
import * as path from 'path';
import * as excel from 'exceljs';
@Injectable()
export class StocksService {
  constructor(private prisma: PrismaService) {}

  async createStockKart(
    data: Prisma.StockKartCreateInput,
    file: Express.Multer.File,
  ): Promise<any> {
    const { CaseBrand, CaseModelVariations, CaseModelTitle, ProductIds } = data;
    const CaseModelImage = this.handleFileUpload(file);
    const stockKarts = [];

    for (const variation of this.toArray(CaseModelVariations)) {
      for (const productId of this.toArray(ProductIds)) {
        const newData: Prisma.StockKartCreateInput = {
          CaseBrand,
          CaseModelImage,
          CaseModelVariations: [variation],
          CaseModelTitle,
          ProductIds: [productId],
        };
        const createdStockKart = await this.prisma.stockKart.create({
          data: newData,
        });
        stockKarts.push(createdStockKart);
      }
    }
    return stockKarts;
  }

  async deleteAllStockKarts(): Promise<any> {
    return this.prisma.stockKart.deleteMany({});
  }

  private handleFileUpload(file: Express.Multer.File): string {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve(__dirname, '..', '..', 'uploads', fileName);
    const fileStream = createWriteStream(filePath);
    fileStream.write(file.buffer);
    return filePath;
  }

  private toArray(
    input:
      | string[]
      | string
      | Prisma.StockKartCreateCaseModelVariationsInput
      | Prisma.StockKartCreateProductIdsInput,
  ): string[] {
    if (Array.isArray(input)) {
      return input;
    }
    if (typeof input === 'string') {
      return input.includes(',') ? input.split(',') : [input];
    }
    if (typeof input === 'object' && 'connect' in input) {
      console.log('connect');
    }
    return [];
  }

  async exportToExcel() {
    // Veritabanından gerekli verileri al
    const stockKarts = await this.prisma.stockKart.findMany({});

    // Excel dosyasını oluştur
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('StokKart');

    // Kolon başlıklarını ekle
    worksheet.addRow([
      'Tipi',
      'Stok Kodu',
      'Stok Adi',
      'Grup Kodu',
      'Kod1',
      'Kod2',
      'Kod3',
      'Kod4',
      'Kod5',
      'Olcu Birim1',
      'Satis Fiyat1',
      'Satis Fiyat2',
      'Satis Fiyat3',
      'Satis Fiyat4',
      'Satis Doviz Tipi',
      'Satis Doviz Fiyat',
      'Alis Doviz Tipi',
      'Alis Doviz Fiyat',
      'Satis Kdv Oran',
      'Alis Kdv Oran',
      'Toptan Satis Kdv Orani',
      'Toptan Alis Kdv Orani',
      'Barkod1',
      'Barkod2',
      'Barkod3',
      'Alis Fiyat1',
      'Alis Fiyat2',
      'Alis Fiyat3',
      'Alis Fiyat4',
      'Risk Adedi',
      'Risk Suresi',
      'Puan',
      'Iskonto',
    ]);

    for (const stockKart of stockKarts) {
      const Product = await this.prisma.product.findUnique({
        where: { id: stockKart.ProductIds[0] },
      });
      const row = worksheet.addRow([
        'Stok',
        `${stockKart.CaseBrand} ${Product.PhoneBrandModelStockCode} ${stockKart.CaseModelVariations}`,
        `${Product.PhoneBrandModelName} ${stockKart.CaseBrand} ${stockKart.CaseModelVariations} ${stockKart.CaseModelTitle}`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        0.01,
        0.01,
        0.01,
        0.01,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        Product.Barcode,
        '',
        '',
        0.01,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);

      row.font = { bold: false };
    }
    // Dosyayı kaydet
    const filePath = path.join(
      __dirname,
      '../../..',
      'exports',
      'StokListesi-myor.xlsx',
    );
    await workbook.xlsx.writeFile(filePath);

    return filePath;
  }
}
