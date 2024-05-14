import { Module } from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { StockCartsController } from './stock-carts.controller';

@Module({
  controllers: [StockCartsController],
  providers: [StockCartsService],
})
export class StockCartsModule {}
