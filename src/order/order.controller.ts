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
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('export-orders-to-excel-admin/:id/:caseName')
  async getExportOrdersWithDetailsToExcelForAdmin(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('caseName') caseName: string,
  ) {
    const filePath =
      await this.orderService.exportOrdersWithDetailsToExcelForAdmin(
        id,
        caseName,
      );
    const fileName = path.basename(filePath);
    res.download(filePath, fileName);
  }

  @Get('export-orders-to-excel-user/:id/:orderId/:caseName')
  async getExportOrdersWithDetailsToExcelByUserId(
    @Res() res: Response,
    @Param('id') id: string,
    @Param('orderId') orderId: string,
    @Param('caseName') caseName: string,
  ) {
    const filePath =
      await this.orderService.exportOrdersWithDetailsToExcelByUserId(
        id,
        orderId,
        caseName,
      );
    const fileName = path.basename(filePath);
    res.download(filePath, fileName);
  }

  @Get('list-uploaded-files/:orderId')
  listUploadedFiles(@Param('orderId') orderId: string) {
    return this.orderService.getUploadedFilesByOrderId(orderId);
  }

  @Post()
  create(@Body() body: any) {
    return this.orderService.create(body);
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    return this.orderService.uploadFile(body, file);
  }

  @Patch('order-status/:id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.orderService.updateOrderStatus(id, body);
  }

  @Patch('order-details-status/:orderId/:caseBrandId')
  updateOrderDetailStatus(
    @Param('orderId') orderId: string,
    @Param('caseBrandId') caseBrandId: string,
    @Body() body: any,
  ) {
    return this.orderService.updateOrderDetailStatus(
      orderId,
      caseBrandId,
      body,
    );
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

  @Get('get-order-files-by-order-id/:id')
  getOrderFilesByOrderId(@Param('id') id: string) {
    return this.orderService.getOrderFilesByOrderId(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.removeOrderWithDetails(id);
  }

  @Delete('delete-uploaded-file/:id')
  removeUploadedFile(@Param('id') id: string) {
    return this.orderService.deleteOrderFile(id);
  }
}
