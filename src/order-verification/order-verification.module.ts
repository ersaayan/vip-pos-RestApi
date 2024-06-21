import { Module } from '@nestjs/common';
import { OrderVerificationService } from './order-verification.service';
import { OrderVerificationController } from './order-verification.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OrderVerificationController],
  providers: [OrderVerificationService, AuthModule],
  imports: [PrismaModule, AuthModule],
  exports: [OrderVerificationService],
})
export class OrderVerificationModule {}
