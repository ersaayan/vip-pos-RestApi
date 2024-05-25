import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma } from '@prisma/client';
import * as excel from 'exceljs';
import { CaseBrandService } from 'src/case-brand/case-brand.service';
import { CaseModelVariationsService } from 'src/case-model-variations/case-model-variations.service';

@Injectable()
export class StockCartsService {
  constructor(
    private prisma: PrismaService,
    private caseBrandService: CaseBrandService,
    private caseModelVariationsService: CaseModelVariationsService,
  ) {}

  async create(data: any, file: Express.Multer.File): Promise<any> {
    const {
      caseBrandId,
      title,
      description,
      barcode,
      cost,
      satisFiyat1,
      satisFiyat2,
      satisFiyat3,
      satisFiyat4,
      quantity,
    } = data;
    const caseImageUrl = await this.saveImage(file);
    const stockCarts = [];
    this.deleteAllStockCartHistory();
    const satisF1 = parseFloat(satisFiyat1);
    const satisF2 = parseFloat(satisFiyat2);
    const satisF3 = parseFloat(satisFiyat3);
    const satisF4 = parseFloat(satisFiyat4);
    const phoneIdsArray: string[] = JSON.parse(data.phoneIds);
    const caseModelArray: string[] = JSON.parse(data.caseModelVariationsIds);
    for (const phoneId of phoneIdsArray) {
      for (const caseModel of caseModelArray) {
        const stockCart: Prisma.StockCartHistoryCreateInput = {
          Phone: {
            connect: {
              id: phoneId,
            },
          },
          CaseBrand: {
            connect: {
              id: caseBrandId,
            },
          },
          CaseModelVariation: {
            connect: {
              id: caseModel,
            },
          },
          caseImage: caseImageUrl,
          title,
          description,
          barcode,
          cost: parseFloat(cost),
          satisFiyat1: satisF1,
          satisFiyat2: satisF2,
          satisFiyat3: satisF3,
          satisFiyat4: satisF4,
          quantity: parseInt(quantity),
        };
        const createdStockCart = await this.prisma.stockCartHistory.create({
          data: stockCart,
        });
        stockCarts.push(createdStockCart);
      }
    }
    return stockCarts;
  }

  private saveImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve(__dirname, '..', '..', 'public', fileName);
    const fileUrl = `/uploads/${fileName}`;

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);
      fileStream.on('finish', () => resolve(fileUrl));
      fileStream.on('error', reject);
      fileStream.write(file.buffer);
      fileStream.end();
    });
  }

  async deleteAllStockCartHistory() {
    return this.prisma.stockCartHistory.deleteMany({});
  }

  async deleteAllStockCart() {
    return this.prisma.stockCart.deleteMany({});
  }

  async getAllStockCartHistoryWithCustomOutput() {
    const stockCartHistories = await this.prisma.stockCartHistory.findMany();
    const stockCartHistoriesWithCustomOutput = stockCartHistories.map(
      async (stockCartHistory) => {
        const phone = await this.prisma.phone.findUnique({
          where: {
            id: stockCartHistory.phoneId,
          },
        });
        return {
          id: stockCartHistory.id,
          caseImage: stockCartHistory.caseImage,
          stockCode: `${stockCartHistory.caseBrand}\\${phone.stockCode}/${stockCartHistory.caseModelVariation}`,
          myorStockName: `${phone.brand} ${phone.model} ${stockCartHistory.caseBrand} ${stockCartHistory.caseModelVariation}`,
          ikasStockName: `${phone.brand} ${phone.model} ${stockCartHistory.title} ${stockCartHistory.caseBrand} ${stockCartHistory.caseModelVariation}`,
          title: stockCartHistory.title,
          description: stockCartHistory.description,
          cost: stockCartHistory.cost,
          quantity: stockCartHistory.quantity,
          barcode: stockCartHistory.barcode,
        };
      },
    );
    return stockCartHistoriesWithCustomOutput;
  }

  async getAllStockCartWithCustomOutput() {
    const stockCarts = await this.prisma.stockCart.findMany();
    const stockCartsWithCustomOutput = stockCarts.map(
      async (stockCartHistory) => {
        const phone = await this.prisma.phone.findUnique({
          where: {
            id: stockCartHistory.phoneId,
          },
        });
        return {
          id: stockCartHistory.id,
          caseImage: stockCartHistory.caseImage,
          stockCode: `${stockCartHistory.caseBrand}\\${phone.stockCode}/${stockCartHistory.caseModelVariation}`,
          myorStockName: `${phone.brand} ${phone.model} ${stockCartHistory.caseBrand} ${stockCartHistory.caseModelVariation}`,
          ikasStockName: `${phone.brand} ${phone.model} ${stockCartHistory.title} ${stockCartHistory.caseBrand} ${stockCartHistory.caseModelVariation}`,
          title: stockCartHistory.title,
          description: stockCartHistory.description,
          cost: stockCartHistory.cost,
          quantity: stockCartHistory.quantity,
          barcode: stockCartHistory.barcode,
        };
      },
    );
    return stockCartsWithCustomOutput;
  }

  async getAllStockCart() {
    return this.prisma.stockCart.findMany();
  }

  async getAllStockCartHistory() {
    const stockCarts = await this.prisma.stockCartHistory.findMany();
    return Promise.all(
      stockCarts.map(async (stockCart) => {
        const caseBrand = await this.caseBrandService.findOne(
          stockCart.caseBrand,
        );
        const caseModelVariation =
          await this.caseModelVariationsService.findOne(
            stockCart.caseModelVariation,
          );
        return {
          id: stockCart.id,
          phoneId: stockCart.phoneId,
          caseBrand: caseBrand.brandName,
          caseModelVariation: caseModelVariation.modelVariation,
          caseImage: stockCart.caseImage,
          title: stockCart.title,
          description: stockCart.description,
          barcode: stockCart.barcode,
          cost: stockCart.cost,
          satisFiyat1: stockCart.satisFiyat1,
          satisFiyat2: stockCart.satisFiyat2,
          satisFiyat3: stockCart.satisFiyat3,
          satisFiyat4: stockCart.satisFiyat4,
          quantity: stockCart.quantity,
        };
      }),
    );
  }

  async deleteStockCartHistoriesIdsNotSent(ids: string[]) {
    const stockCarts = await this.prisma.stockCartHistory.findMany();
    const stockCartIds = stockCarts.map((stockCart) => stockCart.id);
    const stockCartsIdsNotSent = stockCartIds.filter((id) => !ids.includes(id));
    return this.prisma.stockCartHistory.deleteMany({
      where: {
        id: {
          in: stockCartsIdsNotSent,
        },
      },
    });
  }

  async transferStockCartHistoriesToStockCart(): Promise<any> {
    const stockCartHistories = await this.prisma.stockCartHistory.findMany();
    const stockCarts = stockCartHistories.map(async (stockCartHistory) => {
      const newData: Prisma.StockCartCreateInput = {
        Phone: {
          connect: {
            id: stockCartHistory.phoneId,
          },
        },
        CaseBrand: {
          connect: {
            id: stockCartHistory.caseBrand,
          },
        },
        CaseModelVariation: {
          connect: {
            id: stockCartHistory.caseModelVariation,
          },
        },
        caseImage: stockCartHistory.caseImage,
        title: stockCartHistory.title,
        description: stockCartHistory.description,
        barcode: stockCartHistory.barcode,
        cost: stockCartHistory.cost,
        quantity: stockCartHistory.quantity,
      };
      return await this.prisma.stockCart.create({
        data: newData,
      });
    });
    return Promise.all(stockCarts);
  }

  async updateStockCart(id: string, data: Prisma.StockCartUpdateInput) {
    return this.prisma.stockCart.update({
      where: {
        id,
      },
      data,
    });
  }

  async exportStockCartsToExcelForMyor() {
    const stockCarts = await this.prisma.stockCart.findMany();

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'Myor.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const stockCart of stockCarts) {
      const phone = await this.prisma.phone.findUnique({
        where: {
          id: stockCart.phoneId,
        },
      });

      const row = worksheet.addRow([
        'Stok',
        `${stockCart.caseBrand}\\${phone.stockCode}/${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        `${phone.name} ${stockCart.caseBrand} ${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        `${stockCart.title}`,
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
        stockCart.barcode,
        '',
        '',
        stockCart.cost,
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

  async exportStockCartHistoriesToExcelForMyor() {
    const stockCarts = await this.prisma.stockCartHistory.findMany();

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'Myor.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const stockCart of stockCarts) {
      const phone = await this.prisma.phone.findUnique({
        where: {
          id: stockCart.phoneId,
        },
      });

      const row = worksheet.addRow([
        'Stok',
        `${stockCart.caseBrand}\\${phone.stockCode}/${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        `${phone.name} ${stockCart.caseBrand} ${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        `${stockCart.title}`,
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
        stockCart.barcode,
        '',
        '',
        stockCart.cost,
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

  async exportStockCartsToExcelForIkas() {
    const stockCarts = await this.prisma.stockCart.findMany();

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'Ikas.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const stockCart of stockCarts) {
      const phone = await this.prisma.phone.findUnique({
        where: {
          id: stockCart.phoneId,
        },
      });

      const row = worksheet.addRow([
        `${stockCart.caseBrand}-${phone.ikasGroupCode.replace(/\s/g, '')}`,
        '',
        `${phone.brand} ${phone.ikasGroupCode} ${stockCart.title} ${stockCart.caseBrand}`,
        `${stockCart.description}`,
        0.01,
        0.01,
        0.01,
        `${stockCart.barcode}`,
        `${stockCart.caseBrand}\\${phone.stockCode}/${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        'YANLIŞ',
        'Vip Case',
        'Telefon Kılıf ve Aksesuarları>Telefon Kılıfları',
        ``,
        `${stockCart.caseImage}`,
        '',
        '',
        '',
        `${stockCart.quantity}`,
        'Renk',
        `${stockCart.caseModelVariation.replace(/\s/g, '')}`,
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
    const filePath = path.join(
      __dirname,
      '../..',
      'exports',
      'StokListesi-ikas.xlsx',
    );
    await workspace.xlsx.writeFile(filePath);

    return filePath;
  }

  async exportStockCartHistoriesToExcelForIkas() {
    const stockCarts = await this.prisma.stockCartHistory.findMany();

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'Ikas.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const stockCart of stockCarts) {
      const phone = await this.prisma.phone.findUnique({
        where: {
          id: stockCart.phoneId,
        },
      });

      const row = worksheet.addRow([
        `${stockCart.caseBrand}-${phone.ikasGroupCode.replace(/\s/g, '')}`,
        '',
        `${phone.brand} ${phone.ikasGroupCode} ${stockCart.title} ${stockCart.caseBrand}`,
        `${stockCart.description}`,
        0.01,
        0.01,
        0.01,
        `${stockCart.barcode}`,
        `${stockCart.caseBrand}\\${phone.stockCode}/${stockCart.caseModelVariation.replace(
          /\s/g,
          '',
        )}`,
        'YANLIŞ',
        'Vip Case',
        'Telefon Kılıf ve Aksesuarları>Telefon Kılıfları',
        ``,
        `${stockCart.caseImage}`,
        '',
        '',
        '',
        `${stockCart.quantity}`,
        'Renk',
        `${stockCart.caseModelVariation.replace(/\s/g, '')}`,
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
