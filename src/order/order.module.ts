import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  exports: [OrderService],
})
export class OrderModule {}
