/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

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
      Status: {
        connect: {
          id: createOrderDto.statusId,
        },
      },
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
        quantity: createOrderDto.quantity,
        Status: {
          connect: {
            id: createOrderDto.statusId,
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

  async uploadFile(body: any, file: Express.Multer.File): Promise<any> {
    const orderId = body.orderId;
    const fileUrl = await this.saveImage(file);
    const createdData = await this.prisma.orderFiles.create({
      data: {
        Order: {
          connect: {
            id: orderId,
          },
        },
        fileName: `${Date.now()}-${file.originalname}`,
        fileType: file.mimetype,
        fileUrl: fileUrl,
      },
    });
    return createdData;
  }

  private saveImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      'public/orderFiles',
      fileName,
    );
    const fileUrl = `/uploads/orderFiles/${fileName}`;

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);
      fileStream.on('finish', () => resolve(fileUrl));
      fileStream.on('error', reject);
      fileStream.write(file.buffer);
      fileStream.end();
    });
  }

  getOrderFilesByOrderId(orderId: string) {
    return this.prisma.orderFiles.findMany({
      where: {
        orderId,
      },
    });
  }

  getAllOrdersWithoutDetails() {
    return this.prisma.order.findMany({
      select: {
        id: true,
        orderCost: true,
        statusId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  getAllOrdersWithDetails() {
    return this.prisma.order
      .findMany({
        select: {
          id: true,
          orderCost: true,
          createdAt: true,
          updatedAt: true,
          User: {
            select: {
              name: true,
            },
          },
          Status: {
            select: {
              status: true,
            },
          },
          OrderDetail: {
            select: {
              id: true,
              quantity: true,
              createdAt: true,
              updatedAt: true,
              orderId: true,
              Status: {
                select: {
                  status: true,
                },
              },
              StockCart: {
                select: {
                  barcode: true,
                  caseImage: true,
                  CaseBrand: {
                    select: {
                      brandName: true,
                    },
                  },
                  CaseModelVariation: {
                    select: {
                      modelVariationEng: true,
                      modelVariation: true,
                    },
                  },
                  Phone: {
                    select: {
                      name: true,
                      stockCode: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then((orders) => {
        return orders.map((order) => {
          return {
            ...order,
            orderDetail: order.OrderDetail.map((detail) => {
              return {
                ...detail,
                stockCart: {
                  ...detail.StockCart,
                  stockCode: `${detail.StockCart.CaseBrand.brandName}\\${detail.StockCart.Phone.stockCode}//${detail.StockCart.CaseModelVariation.modelVariation}`,
                },
              };
            }),
          };
        });
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

  getOrdersWithDetailsByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        OrderDetail: true,
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
        Status: {
          connect: {
            id: updateOrderDto.statusId,
          },
        },
      },
    });
  }

  removeOrderWithDetails(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  updateOrderDetailStatus(id: string, statusId: string) {
    return this.prisma.orderDetail.update({
      where: { id },
      data: {
        Status: {
          connect: {
            id: statusId,
          },
        },
      },
    });
  }
}
