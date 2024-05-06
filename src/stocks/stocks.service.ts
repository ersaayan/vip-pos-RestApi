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
    const CaseModelImage = await this.handleFileUpload(file);
    const stockKarts = [];
    await this.deleteAllStockKartsYedek();
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
          ProductIds: [productId],
          Description,
          Barcode,
        };
        const createdStockKart = await this.prisma.stockKartYedek.create({
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

  private handleFileUpload(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve(__dirname, '..', '..', 'public', fileName);
    const fileUrl = `/uploads/${fileName}`;

    return new Promise((resolve, reject) => {
      const fileStream = createWriteStream(filePath);
      fileStream.on('finish', () => resolve(fileUrl));
      fileStream.on('error', reject);
      fileStream.write(file.buffer);
      fileStream.end();
    });
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

  async getAllStockKartsWithCustomOutput(): Promise<any[]> {
    const stockKarts = await this.prisma.stockKartYedek.findMany({});
    const customOutput = stockKarts.map(async (stockKart) => {
      const Product = await this.prisma.product.findUnique({
        where: { id: stockKart.ProductIds[0] },
      });
      return {
        id: stockKart.id,
        CaseBrand: stockKart.CaseBrand,
        CaseModelVariations: stockKart.CaseModelVariations,
        CaseModelTitle: stockKart.CaseModelTitle,
        ProductIds: stockKart.ProductIds,
        Description: stockKart.Description,
        Barcode: stockKart.Barcode,
        CaseModelImage: stockKart.CaseModelImage,
        // İstediğiniz özel çıktılar
        myorStockName: `${Product.PhoneBrandModelName} ${stockKart.CaseBrand} ${stockKart.CaseModelVariations[0].replace(/\s/g, ' ')}`,

        ikasStockName: `${Product.PhoneBrandName} ${Product.PhoneModelGroupCode} ${stockKart.CaseModelTitle} ${stockKart.CaseBrand}`,
        stockCode: `${stockKart.CaseBrand}/${Product.PhoneBrandModelStockCode}/${stockKart.CaseModelVariations[0].replace(/\s/g, ' ').trim()}`,
      };
    });
    return Promise.all(customOutput);
  }

  async getAllStockKartsWithCustomOutputDb(): Promise<any[]> {
    const stockKarts = await this.prisma.stockKart.findMany({});
    const customOutput = stockKarts.map(async (stockKart) => {
      const Product = await this.prisma.product.findUnique({
        where: { id: stockKart.ProductIds[0] },
      });
      return {
        id: stockKart.id,
        CaseBrand: stockKart.CaseBrand,
        CaseModelVariations: stockKart.CaseModelVariations,
        CaseModelTitle: stockKart.CaseModelTitle,
        ProductIds: stockKart.ProductIds,
        Description: stockKart.Description,
        Barcode: stockKart.Barcode,
        CaseModelImage: stockKart.CaseModelImage,
        // İstediğiniz özel çıktılar
        myorStockName: `${Product.PhoneBrandModelName} ${stockKart.CaseBrand} ${stockKart.CaseModelVariations[0].replace(/\s/g, ' ')}`,

        ikasStockName: `${Product.PhoneBrandName} ${Product.PhoneModelGroupCode} ${stockKart.CaseModelTitle} ${stockKart.CaseBrand}`,
        stockCode: `${stockKart.CaseBrand}/${Product.PhoneBrandModelStockCode}/${stockKart.CaseModelVariations[0].replace(/\s/g, ' ').trim()}`,
      };
    });
    return Promise.all(customOutput);
  }

  async getAllStockKartsYedek(): Promise<any> {
    return this.prisma.stockKartYedek.findMany({});
  }

  async getAllStockKarts(): Promise<any> {
    return this.prisma.stockKart.findMany({});
  }

  async deleteIdsNotSent(ids: string[]): Promise<any> {
    const allTableIds = await this.prisma.stockKartYedek.findMany({
      select: {
        id: true,
      },
    });
    const allIds = allTableIds.map((item) => item.id);
    const idsToDelete = allIds.filter((id) => !ids.includes(id));
    return this.prisma.stockKartYedek.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  }

  // delete all stock karts from yedek table
  async deleteAllStockKartsYedek(): Promise<any> {
    return this.prisma.stockKartYedek.deleteMany({});
  }

  async updateStockKart(id: string, data: Prisma.StockKartUpdateInput) {
    return this.prisma.stockKart.update({
      where: { id },
      data,
    });
  }

  async updateAllStockKarts(data: Prisma.StockKartUpdateInput) {
    return this.prisma.stockKart.updateMany({
      data: { ...data, updatedAt: new Date() },
    });
  }

  // transfer all stock karts from yedek to main table
  async transferStockKarts(): Promise<any> {
    const stockKarts = await this.prisma.stockKartYedek.findMany({});
    const newStockKarts = stockKarts.map(async (stockKart) => {
      const newData: Prisma.StockKartCreateInput = {
        CaseBrand: stockKart.CaseBrand,
        CaseModelVariations: stockKart.CaseModelVariations,
        CaseModelTitle: stockKart.CaseModelTitle,
        ProductIds: stockKart.ProductIds,
        Description: stockKart.Description,
        Barcode: stockKart.Barcode,
        CaseModelImage: stockKart.CaseModelImage,
      };
      return await this.prisma.stockKart.create({
        data: newData,
      });
    });
    return Promise.all(newStockKarts);
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

  async exportToExcelForMyorYedek() {
    // Veritabanından gerekli verileri al
    const stockKarts = await this.prisma.stockKartYedek.findMany({});

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

  async exportToExcelForIkasYedek() {
    // Veritabanından gerekli verileri al
    const stockKarts = await this.prisma.stockKartYedek.findMany({});

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
