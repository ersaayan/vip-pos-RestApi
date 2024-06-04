import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prismaService: PrismaService) {}
  findAll() {
    return this.prismaService.status.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        status: true,
      },
    });
  }
}
