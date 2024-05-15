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

  findOne(id: number) {
    return `This action returns a #${id} stockCart`;
  }

  update(id: number, updateStockCartDto: UpdateStockCartDto) {
    return `This action updates a #${id} stockCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockCart`;
  }
}
