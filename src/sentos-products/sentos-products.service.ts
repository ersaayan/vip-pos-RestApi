// src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import {
  Prisma,
  SentosImage,
  SentosPrice,
  SentosProduct,
  SentosStock,
  SentosVariant,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SentosProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(
    data: Prisma.SentosProductCreateInput,
  ): Promise<SentosProduct> {
    return this.prisma.sentosProduct.create({ data });
  }

  async createVariant(
    data: Prisma.SentosVariantCreateInput,
  ): Promise<SentosVariant> {
    return this.prisma.sentosVariant.create({ data });
  }

  async createPrice(data: Prisma.SentosPriceCreateInput): Promise<SentosPrice> {
    return this.prisma.sentosPrice.create({ data });
  }

  async createStock(data: Prisma.SentosStockCreateInput): Promise<SentosStock> {
    return this.prisma.sentosStock.create({ data });
  }

  async createImage(data: Prisma.SentosImageCreateInput): Promise<SentosImage> {
    return this.prisma.sentosImage.create({ data });
  }
}
