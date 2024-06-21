import { Module } from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { StockCartsController } from './stock-carts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CaseBrandModule } from 'src/case-brand/case-brand.module';
import { CaseModelVariationsModule } from 'src/case-model-variations/case-model-variations.module';
import { PhonesModule } from 'src/phones/phones.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [StockCartsController],
  providers: [StockCartsService],
  imports: [
    PrismaModule,
    CaseBrandModule,
    CaseModelVariationsModule,
    PhonesModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  exports: [StockCartsService],
})
export class StockCartsModule {}
