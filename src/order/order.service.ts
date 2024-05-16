/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    const orders: any[] = [];
    const stockCartIds: string[] = JSON.parse(createOrderDto.stockCartId);
    for (const stockCartId of stockCartIds) {
      const order = {
        StockCart: {
          connect: {
            id: stockCartId,
          },
        },
        User: {
          connect: {
            id: createOrderDto.userId,
          },
        },
        orderCost: createOrderDto.orderCost,
      };
      const createdOrder = this.prisma.order.create({
        data: order,
      });
      orders.push(createdOrder);
    }
    return orders;
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = {
      where: { id },
      data: {
        orderCost: updateOrderDto.orderCost,
      },
    };
    return this.prisma.order.update(order);
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
