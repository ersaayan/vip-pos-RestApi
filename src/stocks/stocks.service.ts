import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { createWriteStream } from 'fs';
import * as path from 'path';

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
}
