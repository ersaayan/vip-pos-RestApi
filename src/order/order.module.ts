import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, { provide: APP_GUARD, useClass: RolesGuard }],
  imports: [PrismaModule],
  exports: [OrderService],
})
export class OrderModule {}
