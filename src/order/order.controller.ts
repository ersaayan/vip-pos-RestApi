import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() body: any) {
    return this.orderService.create(body);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body: any, file: Express.Multer.File) {
    return this.orderService.uploadFile(file, body.orderId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.orderService.updateOrderStatus(id, updateOrderDto);
  }

  @Get('get-all-orders-without-details')
  getAllOrdersWithoutDetails() {
    return this.orderService.getAllOrdersWithoutDetails();
  }

  @Get('get-order-details-by-order-id/:id')
  getOrderDetailsByOrderId(@Param('id') id: string) {
    return this.orderService.getOrderDetailsByOrderId(id);
  }

  @Get('get-orders-by-user-id/:id')
  getOrdersByUserId(@Param('id') id: string) {
    return this.orderService.getOrdersByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.removeOrderWithDetails(id);
  }
}
