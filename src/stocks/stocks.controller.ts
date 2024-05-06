import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Res,
  Delete,
  Patch,
  Param,
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
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('stock-kart')
@ApiTags('Stock Kart Generator')
export class StocksController {
  constructor(
    private stocksService: StocksService,
    private readonly prismaService: PrismaService,
  ) {}

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
  async getAllStockKartsYedek(): Promise<any> {
    return this.stocksService.getAllStockKartsYedek();
  }

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

  @Get('custom-outputDb')
  @ApiOperation({
    summary: 'Get all stock karts with custom output',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock karts with custom output fetched successfully',
  })
  async getAllStockKartsWithCustomOutputDb(): Promise<any> {
    return this.stocksService.getAllStockKartsWithCustomOutputDb();
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

  @Get('transfer')
  async transferStockCart() {
    try {
      return {
        success: true,
        message: 'Veriler başarıyla transfer edildi',
        data: this.stocksService.transferStockKarts(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Veri transferi sırasında bir hata oluştu',
      };
    }
  }

  @Delete('delete')
  async deleteAllStockKarts() {
    try {
      return {
        success: true,
        message: 'Veriler başarıyla silindi',
        data: this.stocksService.deleteAllStockKarts(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Veri silme sırasında bir hata oluştu',
      };
    }
  }

  @Patch('/update:id')
  updateStockKart(
    @Param('id') id: string,
    @Body() body: Prisma.StockKartUpdateInput,
  ) {
    try {
      console.log('id', id);
      console.log('body', body);
      return {
        success: true,
        message: 'Veri başarıyla güncellendi',
        data: this.stocksService.updateStockKart(id, body),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Veri güncelleme sırasında bir hata oluştu',
      };
    }
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

  @Get('myor-export-yedek')
  @ApiOperation({
    summary: "Swagger doesn't support download file. You must request new tab.",
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportToExcelMyorYedek(@Res() res: Response) {
    const filePath = await this.stocksService.exportToExcelForMyor();
    res.sendFile(path.resolve(filePath));
  }

  @Get('ikas-export-yedek')
  @ApiOperation({
    summary: "Swagger doesn't support download file. You must request new tab.",
  })
  @ApiResponse({
    status: 200,
    description: 'Excel file generated successfully',
  })
  async exportToExcelIkasYedek(@Res() res: Response) {
    const filePath = await this.stocksService.exportToExcelForIkas();
    res.sendFile(path.resolve(filePath));
  }
}
