import { Injectable } from '@nestjs/common';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderVerificationService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, bodyData: CreateOrderVerificationDto) {
    const orderVerification: Prisma.PlatformOrderVerificationCreateInput = {
      User: {
        connect: {
          id: userId,
        },
      },
      kargoTakipNo: bodyData.kargoTakipNo,
    };
    return this.prisma.platformOrderVerification.create({
      data: orderVerification,
    });
  }

  findAll() {
    return this.prisma.platformOrderVerification.findMany();
  }

  findOne(id: string) {
    return this.prisma.platformOrderVerification.findUnique({
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.platformOrderVerification.delete({
      where: { id },
    });
  }
}
