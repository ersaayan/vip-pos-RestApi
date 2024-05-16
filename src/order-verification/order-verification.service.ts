import { Injectable } from '@nestjs/common';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';
import { UpdateOrderVerificationDto } from './dto/update-order-verification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderVerificationService {
  constructor(private prisma: PrismaService) {}
  create(createOrderVerificationDto: CreateOrderVerificationDto) {
    return this.prisma.orderVerification.create({
      data: createOrderVerificationDto,
    });
  }

  findAll() {
    return `This action returns all orderVerification`;
  }

  findOne(id: string) {
    return this.prisma.orderVerification.findUnique({
      where: { id },
    });
  }

  update(id: string, updateOrderVerificationDto: UpdateOrderVerificationDto) {
    return this.prisma.orderVerification.update({
      where: { id },
      data: updateOrderVerificationDto,
    });
  }

  remove(id: string) {
    return this.prisma.orderVerification.delete({
      where: { id },
    });
  }
}
