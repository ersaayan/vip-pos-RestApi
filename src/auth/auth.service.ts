import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException('E-Mail or password is incorrect.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = await this.generateAccessToken(user.id, user.roles[0]);
    return {
      accessToken,
      isSuccess: true,
    };
  }

  private async generateAccessToken(
    userId: string,
    userRole: string,
  ): Promise<string> {
    // get user name from user id
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const username = user.name;
    const payload = { userId, userRole, username };
    const options = { expiresIn: '12h' };
    console.log();
    return this.jwtService.sign(payload, options);
  }
}
