import { Module } from '@nestjs/common';
import { OrderVerificationService } from './order-verification.service';
import { OrderVerificationController } from './order-verification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrderVerificationController],
  providers: [OrderVerificationService],
  imports: [PrismaModule],
  exports: [OrderVerificationService],
})
export class OrderVerificationModule {}
