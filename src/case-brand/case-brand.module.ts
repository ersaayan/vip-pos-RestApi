import { Module } from '@nestjs/common';
import { CaseBrandService } from './case-brand.service';
import { CaseBrandController } from './case-brand.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CaseBrandController],
  providers: [CaseBrandService],
  imports: [PrismaModule],
  exports: [CaseBrandService],
})
export class CaseBrandModule {}
