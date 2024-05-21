import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PhonesModule } from './phones/phones.module';
import { StockCartsModule } from './stock-carts/stock-carts.module';
import { MulterModule } from '@nestjs/platform-express';
import { OrderVerificationModule } from './order-verification/order-verification.module';
import { OrderModule } from './order/order.module';
import { CaseBrandModule } from './case-brand/case-brand.module';
import { CaseModelVariationsModule } from './case-model-variations/case-model-variations.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guard/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    MulterModule.register({
      dest: './public/img', // Dosyaların kaydedileceği klasör
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    PhonesModule,
    StockCartsModule,
    OrderVerificationModule,
    OrderModule,
    CaseBrandModule,
    CaseModelVariationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }, ConfigService],
})
export class AppModule {}
