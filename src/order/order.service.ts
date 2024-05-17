/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async create(createOrderDto: CreateOrderDto) {
    const orders: any[] = [];
    const stockCartIds: string[] = JSON.parse(createOrderDto.stockCartId);
    const order = {
      User: {
        connect: {
          id: createOrderDto.userId,
        },
      },
      orderCost: createOrderDto.orderCost,
      status: createOrderDto.status,
    };
    const createdOrder = await this.prisma.order.create({
      data: order,
    });
    for (const stockCartId of stockCartIds) {
      const orderDetail = {
        Order: {
          connect: {
            id: createdOrder.id,
          },
        },
        StockCart: {
          connect: {
            id: stockCartId,
          },
        },
      };
      const createdOrderDetail = await this.prisma.orderDetail.create({
        data: orderDetail,
      });
      orders.push(createdOrderDetail);
    }
    return {
      order: createdOrder,
      orderDetails: orders,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async uploadFile(file: Express.Multer.File, orderId: string) {
    return this.prisma.orderFiles.create({
      data: {
        Order: {
          connect: {
            id: orderId,
          },
        },
        fileName: file.filename,
        fileType: file.mimetype,
        fileUrl: file.path,
      },
    });
  }

  getAllOrdersWithoutDetails() {
    return this.prisma.order.findMany({
      select: {
        id: true,
        orderCost: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getOrderDetailsByOrderId(orderId: string) {
    return this.prisma.orderDetail.findMany({
      where: {
        orderId,
      },
    });
  }

  getOrdersByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  updateOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
      },
    });
  }

  removeOrderWithDetails(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
