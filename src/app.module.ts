import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StocksModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/uploads',
    }),
    DatabaseModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
