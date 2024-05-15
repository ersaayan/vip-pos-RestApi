/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StockCartsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createStockCartDto: CreateStockCartDto,
    file: Express.Multer.File,
  ) {
    const { phoneIds, caseModelVariations, ...rest } = createStockCartDto;
    const imagePath = file ? `/public/img/${file.filename}` : null;

    for (const phoneId of phoneIds) {
      for (const caseModelVariation of caseModelVariations) {
        await this.prisma.stockCart.create({
          data: {
            phoneId,
            caseModelVariation,
            caseImage: imagePath,
            ...rest,
          },
        });
      }
    }
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const uploadPath = path.join(__dirname, '..', 'public', 'img');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const filePath = path.join(uploadPath, file.filename);
    fs.writeFileSync(filePath, file.buffer);
    return `/public/img/${file.filename}`;
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

  async update(id: string, updateStockCartDto: UpdateStockCartDto) {
    return await this.prisma.stockCart.update({
      where: {
        id: id,
      },
      data: updateStockCartDto,
    });
  }

  remove(id: string) {
    return this.prisma.stockCart.delete({
      where: {
        id: id,
      },
    });
  }
}
