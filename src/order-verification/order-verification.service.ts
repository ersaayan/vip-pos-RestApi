import { Injectable } from '@nestjs/common';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderVerificationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, bodyData: CreateOrderVerificationDto) {
    const orderVerification: Prisma.OrderVerificationCreateInput = {
      User: {
        connect: {
          id: userId,
        },
      },
      kargoTakipNo: bodyData.kargoTakipNo,
    };
    return this.prisma.orderVerification.create({
      data: orderVerification,
    });
  }

  findAll() {
    return this.prisma.orderVerification.findMany();
  }

  findOne(id: string) {
    return this.prisma.orderVerification.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.orderVerification.delete({
      where: { id },
    });
  }
}
