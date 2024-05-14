import { Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhonesService {
  constructor(private prisma: PrismaService) {
    this.prisma = prisma;
  }

  async create(createPhoneDto: CreatePhoneDto) {
    return this.prisma.phone.create({
      data: createPhoneDto,
    });
  }

  async createMany(createPhoneDto: CreatePhoneDto[]) {
    return this.prisma.phone.createMany({
      data: createPhoneDto,
    });
  }

  findAll() {
    return this.prisma.phone.findMany();
  }

  findOne(id: string) {
    return this.prisma.phone.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updatePhoneDto: UpdatePhoneDto) {
    return this.prisma.phone.update({
      where: {
        id,
      },
      data: updatePhoneDto,
    });
  }

  remove(id: string) {
    return this.prisma.phone.delete({
      where: {
        id,
      },
    });
  }
}
