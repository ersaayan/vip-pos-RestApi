import { Injectable } from '@nestjs/common';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockCartsService {
  constructor(private prisma: PrismaService) {}
  async create(createStockCartDto: CreateStockCartDto) {
    return await this.prisma.stockCart.create({
      data: createStockCartDto,
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