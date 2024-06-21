/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as excel from 'exceljs';
import * as moment from 'moment';

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
    const fileUrl = await this.saveFile(file);
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

  private saveFile(file: Express.Multer.File): Promise<string> {
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
      try {
        const sourcePath = path.resolve(file.path);
        const destPath = path.resolve(filePath);

        const sourceStream = fs.createReadStream(sourcePath);
        const destStream = fs.createWriteStream(destPath);

        sourceStream.pipe(destStream);

        destStream.on('finish', () => {
          console.log(`File saved: ${filePath}`);
          resolve(fileUrl);
        });

        destStream.on('error', (err) => {
          console.error('Error saving file:', err);
          reject(err);
        });
      } catch (err) {
        console.error('Error saving file:', err);
        reject(err);
      }
    });
  }

  getUploadedFilesByOrderId(orderId: string) {
    return this.prisma.orderFiles.findMany({
      where: {
        orderId,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
      },
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
          OrderFiles: {
            select: {
              id: true,
              fileName: true,
              fileUrl: true,
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
                      id: true,
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
        orderBy: {
          createdAt: 'asc',
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
    return this.prisma.order
      .findMany({
        where: {
          User: {
            id: userId,
          },
        },
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
                      id: true,
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
        orderBy: {
          createdAt: 'asc',
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

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  updateOrderStatus(id: string, statusId: string) {
    return this.prisma.order.update({
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

  removeOrderWithDetails(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async deleteOrderFile(orderFileId: string) {
    const orderFile = await this.prisma.orderFiles.findUnique({
      where: {
        id: orderFileId,
      },
    });
    if (!orderFile) {
      throw new Error('Dosya bulunamadı!');
    }
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      'public/orderFiles',
      orderFile.fileName,
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Dosya silinirken bir hata oluştu:', err);
      } else {
        console.log('Dosya başarıyla silindi.');
      }
    });

    return this.prisma.orderFiles.delete({
      where: {
        id: orderFileId,
      },
    });
  }

  async updateOrderDetailStatus(
    orderId: string,
    caseBrandId: string,
    body: any,
  ) {
    const statusId = body.statusId;
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderDetail: {
          include: {
            StockCart: {
              include: {
                CaseBrand: true,
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new Error('Sipariş bulunamadı!');
    }
    const orderDetailToBeUpdatedList = [];
    for (const detail of order.OrderDetail) {
      const orderDetailToBeUpdated = await this.prisma.orderDetail.findUnique({
        where: {
          id: detail.id,
          StockCart: {
            CaseBrand: {
              id: caseBrandId,
            },
          },
        },
      });
      if (!orderDetailToBeUpdated) {
        continue;
      }
      orderDetailToBeUpdatedList.push(orderDetailToBeUpdated);
    }

    if (!orderDetailToBeUpdatedList.length) {
      throw new Error('Sipariş detayı bulunamadı!');
    }

    for (const orderDetail of orderDetailToBeUpdatedList) {
      await this.prisma.orderDetail.update({
        where: { id: orderDetail.id },
        data: {
          Status: {
            connect: {
              id: statusId,
            },
          },
        },
      });
    }

    const updatedOrderDetails = await this.prisma.orderDetail.findMany({
      where: {
        Order: {
          id: orderId,
        },
      },
      include: {
        Status: true,
      },
    });
    const newOrderStatusId = this.calculateOrderStatus(updatedOrderDetails);
    await this.updateOrderStatus(orderId, newOrderStatusId);
  }

  calculateOrderStatus(orderDetails: any[]): string {
    const statuses = orderDetails.map((detail) => detail.Status.status);
    const uniqueStatuses = new Set(statuses);

    if (uniqueStatuses.size === 1) {
      // Tüm durumlar aynı ise o durumu döndür
      return orderDetails[0].Status.id;
    } else {
      const statusPriority = {
        'In Production': 1,
        'Production Completed': 2,
        'Packaging in Progress': 3,
        'Packaging Completed': 4,
        'Awaiting Shipment': 5,
        Shipped: 6,
        Delivered: 7,
        'Order Completed': 8,
        Cancelled: 9,
        'Return Requested': 10,
        'Return Approved': 11,
        'Return Processed': 12,
        // ... diğer durumlar için öncelikleri ekleyin
      };

      const sortedDetails = orderDetails.slice().sort((a, b) => {
        return (
          statusPriority[a.Status.status] - statusPriority[b.Status.status]
        );
      });

      return sortedDetails[0].Status.id; // En yüksek öncelikli durumu döndür
    }
  }

  async exportOrdersWithDetailsToExcelForAdmin(orderId: string, Case_Brand_name: string) {
    let orders = await this.prisma.order.findMany({
      where: {
        id: orderId,
      },
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
                    id: true,
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    orders = orders.map((order) => {
      return {
        ...order,
        OrderDetail: order.OrderDetail.map((detail) => {
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

    const excelData = orders.map((item) => {
      const groupedOrderDetails = item.OrderDetail.reduce(
        (acc: { [key: string]: any[] }, detail: any) => {
          const brandName = detail.stockCart.CaseBrand.brandName; // brandName yerine phoneName kullanılıyor
          acc[brandName] = acc[brandName] || [];
          acc[brandName].push({
            id: detail.id,
            orderId: detail.orderId,
            caseImage: detail.stockCart.caseImage,
            brandId: detail.stockCart.CaseBrand.id,
            brandName: detail.stockCart.CaseBrand.brandName,
            caseModel: detail.stockCart.CaseModelVariation.modelVariationEng,
            caseModelTr: detail.stockCart.CaseModelVariation.modelVariation,
            phoneName: detail.stockCart.Phone.name,
            label:
              detail.stockCart.Phone.name.replace('Redmi Note', 'RM-Note') +
              '-' +
              detail.stockCart.CaseModelVariation.modelVariation +
              ' ' +
              detail.stockCart.CaseBrand.brandName,
            stockCode: detail.stockCart.stockCode,
            barcode: detail.stockCart.barcode,
            quantity: detail.quantity,
            status: detail.Status.status,
            createdAt: new Date(detail.createdAt),
            updatedAt: new Date(detail.updatedAt),
          });
          return acc;
        },
        {},
      );
      return {
        id: item.id,
        orderCost: item.orderCost,
        user: item.User.name,
        status: item.Status.status,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        orderDetails: groupedOrderDetails,
      };
    });

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'order_template.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const data of excelData) {
      for (const detail of data.orderDetails[Case_Brand_name]) {
        const row = worksheet.addRow([
          `http://localhost:1303${detail.caseImage}`,
          `${detail.brandName}`,
          `${detail.phoneName}`,
          `${detail.caseModel}`,
          `${detail.caseModelTr}`,
          `${detail.label}`,
          `${detail.barcode}`,
          `${detail.quantity}`,
        ]);
      }
    }
    const orderNoAndDate = `${moment(excelData[0].createdAt).format('YYYYMMDD-HHmmss')}`;
    const filePath = path.join(
      __dirname,
      '../..',
      'exports',
      `${orderNoAndDate}_VIPCASE_ORDER.xlsx`,
    );

    await workspace.xlsx.writeFile(filePath);

    return filePath;
  }

  async exportOrdersWithDetailsToExcelByUserId(userId: string, orderId: string, Case_Brand_name: string) {
    let orders = await this.prisma.order.findMany({
      where: {
        id: orderId,
        User: {
          id: userId,
        },
      },
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
                    id: true,
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
      orderBy: {
        createdAt: 'asc',
      },
    });

    orders = orders.map((order) => {
      return {
        ...order,
        OrderDetail: order.OrderDetail.map((detail) => {
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

    const excelData = orders.map((item) => {
      const groupedOrderDetails = item.OrderDetail.reduce(
        (acc: { [key: string]: any[] }, detail: any) => {
          const brandName = detail.stockCart.CaseBrand.brandName; // brandName yerine phoneName kullanılıyor
          acc[brandName] = acc[brandName] || [];
          acc[brandName].push({
            id: detail.id,
            orderId: detail.orderId,
            caseImage: detail.stockCart.caseImage,
            brandId: detail.stockCart.CaseBrand.id,
            brandName: detail.stockCart.CaseBrand.brandName,
            caseModel: detail.stockCart.CaseModelVariation.modelVariationEng,
            caseModelTr: detail.stockCart.CaseModelVariation.modelVariation,
            phoneName: detail.stockCart.Phone.name,
            label:
              detail.stockCart.Phone.name.replace('Redmi Note', 'RM-Note') +
              '-' +
              detail.stockCart.CaseModelVariation.modelVariation +
              ' ' +
              detail.stockCart.CaseBrand.brandName,
            stockCode: detail.stockCart.stockCode,
            barcode: detail.stockCart.barcode,
            quantity: detail.quantity,
            status: detail.Status.status,
            createdAt: new Date(detail.createdAt),
            updatedAt: new Date(detail.updatedAt),
          });
          return acc;
        },
        {},
      );
      return {
        id: item.id,
        orderCost: item.orderCost,
        user: item.User.name,
        status: item.Status.status,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        orderDetails: groupedOrderDetails,
      };
    });

    const workbook = new excel.Workbook();
    const templateFilePath = path.join(
      __dirname,
      '../..',
      'templates',
      'order_template.xlsx',
    );
    const workspace = await workbook.xlsx.readFile(templateFilePath);
    const worksheet = workspace.getWorksheet(1);

    for (const data of excelData) {
      for (const detail of data.orderDetails[Case_Brand_name]) {
        const row = worksheet.addRow([
          `http://localhost:1303${detail.caseImage}`,
          `${detail.brandName}`,
          `${detail.phoneName}`,
          `${detail.caseModel}`,
          `${detail.caseModelTr}`,
          `${detail.label}`,
          `${detail.barcode}`,
          `${detail.quantity}`,
        ]);
      }
    }
    const orderNoAndDate = `${moment(excelData[0].createdAt).format('YYYYMMDD-HHmmss')}`;
    const filePath = path.join(
      __dirname,
      '../..',
      'exports',
      `${orderNoAndDate}_VIPCASE_ORDER.xlsx`,
    );

    await workspace.xlsx.writeFile(filePath);

    return filePath;
  }
}
