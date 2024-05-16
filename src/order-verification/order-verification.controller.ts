import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderVerificationService } from './order-verification.service';
import { CreateOrderVerificationDto } from './dto/create-order-verification.dto';
import { UpdateOrderVerificationDto } from './dto/update-order-verification.dto';

@Controller('order-verification')
export class OrderVerificationController {
  constructor(
    private readonly orderVerificationService: OrderVerificationService,
  ) {}

  @Post()
  create(@Body() createOrderVerificationDto: CreateOrderVerificationDto) {
    return this.orderVerificationService.create(createOrderVerificationDto);
  }

  @Get()
  findAll() {
    return this.orderVerificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderVerificationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderVerificationDto: UpdateOrderVerificationDto,
  ) {
    return this.orderVerificationService.update(id, updateOrderVerificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderVerificationService.remove(id);
  }
}
