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
    const {
      CaseBrand,
      CaseModelVariations,
      CaseModelTitle,
      ProductIds,
      Description,
      Barcode,
    } = data;
    const CaseModelImage = this.handleFileUpload(file);
    const stockKarts = [];
    for (const productId of this.toArray(ProductIds)) {
      for (const variation of this.toArray(CaseModelVariations)) {
        const ProductSKU = await this.prisma.product.findUnique({
          where: { id: productId },
        });
        console.log(ProductSKU);
        const newData: Prisma.StockKartCreateInput = {
          CaseBrand,
          CaseModelImage,
          CaseModelVariations: [variation],
          CaseModelTitle,
          ProductIds: [
            `${CaseBrand}\\${ProductSKU.PhoneBrandModelStockCode}/${CaseModelVariations[0].replace(/\s/g, '')}`,
          ],
          Description,
          Barcode,
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

  async getAllStockKarts(): Promise<any> {
    return this.prisma.stockKart.findMany({});
  }

  async deleteIdsNotSent(ids: string[]): Promise<any> {
    const allTableIds = await this.prisma.stockKart.findMany({
      select: {
        id: true,
      },
    });
    const allIds = allTableIds.map((item) => item.id);
    const idsToDelete = allIds.filter((id) => !ids.includes(id));
    return this.prisma.stockKart.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  }

  async exportToExcelForMyor() {
    // Veritabanından gerekli verileri al
    const stockKarts = await this.prisma.stockKart.findMany({});

    // Excel dosyasını oluştur
    const workspace = new excel.Workbook();
    const tempfilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'StokListesi.xlsx',
    );
    const workbook = await workspace.xlsx.readFile(tempfilePath);
    const worksheet = await workbook.getWorksheet(1);

    for (const stockKart of stockKarts) {
      const Product = await this.prisma.product.findUnique({
        where: { id: stockKart.ProductIds[0] },
      });
      const row = worksheet.addRow([
        'Stok',
        `${stockKart.CaseBrand}\\${Product.PhoneBrandModelStockCode}/${stockKart.CaseModelVariations[0].replace(
          /\s/g,
          '',
        )}`,
        `${Product.PhoneBrandModelName} ${stockKart.CaseBrand} ${stockKart.CaseModelVariations[0].replace(
          /\s/g,
          '',
        )}`,
        `${stockKart.CaseModelTitle}`,
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
        stockKart.Barcode,
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
      '../..',
      'exports',
      'StokListesi-myor.xlsx',
    );
    await workspace.xlsx.writeFile(filePath);

    return filePath;
  }

  async exportToExcelForIkas() {
    // Veritabanından gerekli verileri al
    const stockKarts = await this.prisma.stockKart.findMany({});

    // Excel dosyasını oluştur
    const workspace = new excel.Workbook();
    const tempfilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'IkasUrunEkleme.xlsx',
    );
    const workbook = await workspace.xlsx.readFile(tempfilePath);
    const worksheet = await workbook.getWorksheet(1);

    for (const stockKart of stockKarts) {
      const Product = await this.prisma.product.findUnique({
        where: { id: stockKart.ProductIds[0] },
      });
      const row = worksheet.addRow([
        `${stockKart.CaseBrand}-${Product.PhoneModelGroupCode.replace(
          /\s/g,
          '',
        )}`,
        '',
        `${Product.PhoneBrandName} ${Product.PhoneModelGroupCode} ${stockKart.CaseModelTitle} ${stockKart.CaseBrand}`,
        `${stockKart.Description}`,
        0.01,
        0.01,
        0.01,
        `${stockKart.Barcode}`,
        `${stockKart.CaseBrand}\\${Product.PhoneBrandModelStockCode}/${stockKart.CaseModelVariations[0].replace(
          /\s/g,
          '',
        )}`,
        'YANLIŞ',
        'Vip Case',
        'Telefon Kılıf ve Aksesuarları>Telefon Kılıfları',
        ``,
        `${stockKart.CaseModelImage}`,
        '',
        '',
        '',
        50,
        'Renk',
        `${stockKart.CaseModelVariations[0].replace(/\s/g, '')}`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'VISIBLE',
        'PASSIVE',
        '',
        '',
        '',
        '',
      ]);

      row.font = { bold: false };
    }
    // Dosyayı kaydet
    const filePath = path.join(
      __dirname,
      '../..',
      'exports',
      'StokListesi-ikas.xlsx',
    );
    await workspace.xlsx.writeFile(filePath);

    return filePath;
  }
}
