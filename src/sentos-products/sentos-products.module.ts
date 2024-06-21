import { Module } from '@nestjs/common';
import { SentosProductsService } from './sentos-products.service';

@Module({
  controllers: [],
  providers: [SentosProductsService],
})
export class SentosProductsModule {}
