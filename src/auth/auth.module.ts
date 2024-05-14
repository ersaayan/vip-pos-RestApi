import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

const jwt_secret = process.env.JWT_SECRET || 'jwt_secret_key@@';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: jwt_secret,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
