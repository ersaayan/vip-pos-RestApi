import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockCartsService } from './stock-carts.service';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';

@Controller('stock-carts')
export class StockCartsController {
  constructor(private readonly stockCartsService: StockCartsService) {}

  @Post()
  create(@Body() createStockCartDto: CreateStockCartDto) {
    return this.stockCartsService.create(createStockCartDto);
  }

  @Get()
  findAll() {
    return this.stockCartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockCartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockCartDto: UpdateStockCartDto) {
    return this.stockCartsService.update(+id, updateStockCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockCartsService.remove(+id);
  }
}
