import { Injectable } from '@nestjs/common';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderVerificationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, bodyData: CreateOrderVerificationDto) {
    const orderVerification: Prisma.PLatformOrderVerificationCreateInput = {
      User: {
        connect: {
          id: userId,
        },
      },
      kargoTakipNo: bodyData.kargoTakipNo,
    };
    return this.prisma.pLatformOrderVerification.create({
      data: orderVerification,
    });
  }

  findAll() {
    return this.prisma.pLatformOrderVerification.findMany();
  }

  findOne(id: string) {
    return this.prisma.pLatformOrderVerification.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.pLatformOrderVerification.delete({
      where: { id },
    });
  }
}
