/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma } from '@prisma/client';

@Injectable()
export class StockCartsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateStockCartDto,
    file: Express.Multer.File,
  ): Promise<any> {
    const {
      caseBrand,
      caseModelVariations,
      caseImage,
      title,
      description,
      barcode,
      cost,
      quantity,
    } = data;
    const caseImageUrl = await this.saveImage(file);
    const stockCarts = [];
    await this.prisma.stockCartHistory.deleteMany({});
    const phoneIdsArray: string[] = JSON.parse(data.phoneIds);
    const caseModelArray: string[] = JSON.parse(data.caseModelVariations);
    for (const phoneId of phoneIdsArray) {
      for (const caseModel of caseModelArray) {
        const stockCart: Prisma.StockCartHistoryCreateInput = {
          Phone: {
            connect: {
              id: phoneId,
            },
          },
          caseBrand,
          caseModelVariation: caseModel,
          caseImage: caseImageUrl,
          title,
          description,
          barcode,
          cost: parseFloat(cost),
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

  findAll() {
    return this.prisma.stockCart.findMany();
  }

  findOne(id: string) {
    return this.prisma.stockCart.findUnique({
      where: {
        id: id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.stockCart.delete({
      where: {
        id: id,
      },
    });
  }

  private toArray(input: string[] | string): string[] {
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
