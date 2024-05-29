import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: any) {
    return this.orderService.create(body);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
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

  @Get('get-all-orders-with-details')
  getAllOrdersWithDetails() {
    return this.orderService.getAllOrdersWithDetails();
  }

  @Get('get-order-details-by-order-id/:id')
  getOrderDetailsByOrderId(@Param('id') id: string) {
    return this.orderService.getOrderDetailsByOrderId(id);
  }

  @Get('get-orders-by-user-id/:id')
  getOrdersByUserId(@Param('id') id: string) {
    return this.orderService.getOrdersByUserId(id);
  }

  @Get('get-orders-with-details-by-user-id/:id')
  getOrdersWithDetailsByUserId(@Param('id') id: string) {
    return this.orderService.getOrdersWithDetailsByUserId(id);
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
