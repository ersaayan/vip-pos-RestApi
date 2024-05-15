import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';

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
      quantity,
    } = body;
    const data: CreateStockCartDto = {
      phoneIds: phoneIds,
      caseModelVariations,
      caseBrand,
      caseImage: file.filename,
      title,
      description,
      barcode,
      cost,
      quantity,
    };
    const stockCart = await this.stockCartsService.create(data, file);
    return stockCart;
  }

  @Get()
  findAll() {
    return this.stockCartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockCartsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockCartsService.remove(id);
  }
}
