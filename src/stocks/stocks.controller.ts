import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { Prisma } from '@prisma/client';
import { StocksEntity } from './entities/stocks.entity';
import { Response } from 'express';
import * as path from 'path';

@Controller('stock-kart')
@ApiTags('Stock Kart Generator')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('CaseModelImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Stock Kart data',
    type: StocksEntity,
  })
  @ApiCreatedResponse({ type: StocksEntity })
  async createStockKart(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    await this.stocksService.deleteAllStockKarts();
    const {
      CaseBrand,
      CaseModelVariations,
      CaseModelTitle,
      ProductIds,
      Description,
      Barcode,
    } = body;
    const data: Prisma.StockKartCreateInput = {
      CaseBrand,
      CaseModelImage: file.filename,
      CaseModelVariations: CaseModelVariations.split(','),
      CaseModelTitle,
      ProductIds: ProductIds.split(','),
      Description,
      Barcode,
    };
    const createdStockKart = await this.stocksService.createStockKart(
      data,
      file,
    );
    return createdStockKart;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all stock karts',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock karts fetched successfully',
  })
  async getAllStockKarts(): Promise<any> {
    return this.stocksService.getAllStockKarts();
  }

  @Get('custom-output')
  @ApiOperation({
    summary: 'Get all stock karts with custom output',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock karts with custom output fetched successfully',
  })
  async getAllStockKartsWithCustomOutput(): Promise<any> {
    return this.stocksService.getAllStockKartsWithCustomOutput();
  }

  @Delete('delete-ids-not-sent')
  @ApiOperation({
    summary: 'Delete stock karts except the ones with provided IDs',
  })
  @ApiBody({
    description: 'Array of IDs to keep',
    type: [String],
  })
  async deleteIdsNotSent(@Body() body: any): Promise<any> {
    const { ids } = body;
    return this.stocksService.deleteIdsNotSent(ids);
  }

  @Get('myor-export')
  @ApiOperation({
    summary: "Swagger doesn't support download file. You must request new tab.",
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportToExcelMyor(@Res() res: Response) {
    const filePath = await this.stocksService.exportToExcelForMyor();
    res.sendFile(path.resolve(filePath));
  }

  @Get('ikas-export')
  @ApiOperation({
    summary: "Swagger doesn't support download file. You must request new tab.",
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportToExcelIkas(@Res() res: Response) {
    const filePath = await this.stocksService.exportToExcelForIkas();
    res.sendFile(path.resolve(filePath));
  }
}
