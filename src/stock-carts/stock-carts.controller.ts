import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Patch,
  Param,
  Res,
} from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { Response } from 'express';
import * as path from 'path';

@Controller('stock-carts')
export class StockCartsController {
  constructor(private readonly stockCartsService: StockCartsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('caseImage'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const {
      phoneIds,
      caseModelVariations,
      caseBrand,
      title,
      description,
      barcode,
      cost,
      satisFiyat1,
      satisFiyat2,
      satisFiyat3,
      satisFiyat4,
      quantity,
    } = body;
    const data: CreateStockCartDto = {
      phoneIds: phoneIds,
      caseModelVariationsIds: caseModelVariations,
      caseBrandId: caseBrand,
      caseImage: file.filename,
      title,
      description,
      barcode,
      cost,
      satisFiyat1,
      satisFiyat2,
      satisFiyat3,
      satisFiyat4,
      quantity,
    };
    const stockCart = await this.stockCartsService.create(data, file);
    return stockCart;
  }

  @Get()
  async getAllStockCart() {
    return await this.stockCartsService.getAllStockCart();
  }

  @Get('history')
  async getStockCartHistory() {
    return await this.stockCartsService.getAllStockCartHistory();
  }

  @Get('custom-output')
  async getCustomOutput() {
    return await this.stockCartsService.getAllStockCartWithCustomOutput();
  }

  @Get('custom-output-history')
  async getCustomOutputHistory() {
    return await this.stockCartsService.getAllStockCartHistoryWithCustomOutput();
  }

  @Get('transfer')
  async getTransfer() {
    return await this.stockCartsService.transferStockCartHistoriesToStockCart();
  }

  @Delete('stock-cart-all')
  async deleteAllStockCart() {
    return await this.stockCartsService.deleteAllStockCart();
  }

  @Delete('stock-cart-history-all')
  async deleteAllStockCartHistory() {
    return await this.stockCartsService.deleteAllStockCartHistory();
  }

  @Delete('stock-cart-histories-ids-not-sent')
  async deleteStockCartHistoriesIdsNotSent(@Body() body: any) {
    const ids = JSON.parse(body.ids);
    return await this.stockCartsService.deleteStockCartHistoriesIdsNotSent(ids);
  }

  @Patch('/update-stock-cart/:id')
  async updateStockCart(@Param('id') id: string, @Body() body: any) {
    try {
      return {
        success: true,
        message: 'Stock cart updated successfully',
        data: await this.stockCartsService.updateStockCart(id, body),
      };
    } catch (error) {
      return {
        success: false,
        message: `Stock cart not updated. Error: ${error.message}`,
      };
    }
  }

  @Get('export-stock-cart-myor')
  async exportStockCartMyor(@Res() res: Response) {
    const filePath =
      await this.stockCartsService.exportStockCartsToExcelForMyor();
    res.sendFile(path.resolve(filePath));
  }

  @Get('export-stock-cart-history-myor')
  async exportStockCartHistoryMyor(@Res() res: Response) {
    const filePath =
      await this.stockCartsService.exportStockCartHistoriesToExcelForMyor();
    res.sendFile(path.resolve(filePath));
  }

  @Get('export-stock-cart-ikas')
  async exportStockCartIkas(@Res() res: Response) {
    const filePath =
      await this.stockCartsService.exportStockCartsToExcelForIkas();
    res.sendFile(path.resolve(filePath));
  }

  @Get('export-stock-cart-history-ikas')
  async exportStockCartHistoryIkas(@Res() res: Response) {
    const filePath =
      await this.stockCartsService.exportStockCartHistoriesToExcelForIkas();
    res.sendFile(path.resolve(filePath));
  }
}
