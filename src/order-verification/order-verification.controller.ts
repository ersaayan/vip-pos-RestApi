import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderVerificationService } from './order-verification.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';

@Controller('order-verification')
export class OrderVerificationController {
  constructor(
    private readonly orderVerificationService: OrderVerificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser() user: User, @Body() data: CreateOrderVerificationDto) {
    return this.orderVerificationService.create(user.id, data);
  }

  @Get()
  findAll() {
    return this.orderVerificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderVerificationService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderVerificationService.remove(id);
  }
}
