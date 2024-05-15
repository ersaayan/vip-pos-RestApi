import { Module } from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { StockCartsController } from './stock-carts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StockCartsController],
  providers: [StockCartsService],
  imports: [PrismaModule],
  exports: [StockCartsService],
})
export class StockCartsModule {}
