import { Module } from '@nestjs/common';
import { CaseModelVariationsService } from './case-model-variations.service';
import { CaseModelVariationsController } from './case-model-variations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CaseModelVariationsController],
  providers: [CaseModelVariationsService],
  imports: [PrismaModule],
  exports: [CaseModelVariationsService],
})
export class CaseModelVariationsModule {}
