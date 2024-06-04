import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthenticationMiddleware } from './auth/middleware/auth.middleware';
import { StatusModule } from './status/status.module';
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
    StatusModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('/order-verification');
  }
}
