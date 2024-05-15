import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stock-carts')
export class StockCartsController {
  constructor(private readonly stockCartsService: StockCartsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('caseImage'))
  async create(
    @Body() createStockCartDto: CreateStockCartDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.stockCartsService.create(createStockCartDto, file);
  }

  @Get()
  findAll() {
    return this.stockCartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockCartsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockCartDto: UpdateStockCartDto,
  ) {
    return this.stockCartsService.update(id, updateStockCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockCartsService.remove(id);
  }
}
