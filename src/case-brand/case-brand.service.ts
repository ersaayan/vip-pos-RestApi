import { Injectable } from '@nestjs/common';
import { CreateCaseBrandDto } from './dto/create-case-brand.dto';
import { UpdateCaseBrandDto } from './dto/update-case-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CaseBrandService {
  constructor(private prisma: PrismaService) {}
  create(createCaseBrandDto: CreateCaseBrandDto) {
    return this.prisma.caseBrand.create({
      data: createCaseBrandDto,
    });
  }

  findAll() {
    return this.prisma.caseBrand.findMany();
  }

  async findOne(id: string) {
    return this.prisma.caseBrand.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCaseBrandDto: UpdateCaseBrandDto) {
    return this.prisma.caseBrand.update({
      where: { id },
      data: updateCaseBrandDto,
    });
  }

  remove(id: string) {
    return this.prisma.caseBrand.delete({
      where: { id },
    });
  }
}
