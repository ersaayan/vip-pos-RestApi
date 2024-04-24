import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StocksService } from './stocks.service';
import { Prisma } from '@prisma/client';
import { StocksEntity } from './entities/stocks.entity';

@Controller('stock-kart')
@ApiTags('Stock Kart Generator')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('CaseModelImage'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    const { CaseBrand, CaseModelVariations, CaseModelTitle, ProductIds } = body;
    const data: Prisma.StockKartCreateInput = {
      CaseBrand,
      CaseModelImage: file.filename,
      CaseModelVariations: CaseModelVariations.split(','),
      CaseModelTitle,
      ProductIds: ProductIds.split(','),
    };
    const createdStockKart = await this.stocksService.createStockKart(
      data,
      file,
    );
    return createdStockKart;
  }
}
