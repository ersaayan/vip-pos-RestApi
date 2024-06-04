import { Injectable } from '@nestjs/common';
import { CreateCaseModelVariationDto } from './dto/create-case-model-variation.dto';
import { UpdateCaseModelVariationDto } from './dto/update-case-model-variation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CaseModelVariationsService {
  constructor(private prisma: PrismaService) {}

  create(createCaseModelVariationDto: CreateCaseModelVariationDto) {
    return this.prisma.caseModelVariation.create({
      data: createCaseModelVariationDto,
    });
  }

  findAll() {
    return this.prisma.caseModelVariation.findMany();
  }

  findOne(id: string) {
    return this.prisma.caseModelVariation.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCaseModelVariationDto: UpdateCaseModelVariationDto) {
    return this.prisma.caseModelVariation.update({
      where: { id },
      data: updateCaseModelVariationDto,
    });
  }

  remove(id: string) {
    return this.prisma.caseModelVariation.delete({
      where: { id },
    });
  }
}
