import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CaseBrandService } from './case-brand.service';
import { CreateCaseBrandDto } from './dto/create-case-brand.dto';
import { UpdateCaseBrandDto } from './dto/update-case-brand.dto';

@Controller('case-brand')
export class CaseBrandController {
  constructor(private readonly caseBrandService: CaseBrandService) {}

  @Post()
  create(@Body() createCaseBrandDto: CreateCaseBrandDto) {
    return this.caseBrandService.create(createCaseBrandDto);
  }

  @Get()
  findAll() {
    return this.caseBrandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseBrandService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCaseBrandDto: UpdateCaseBrandDto,
  ) {
    return this.caseBrandService.update(id, updateCaseBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseBrandService.remove(id);
  }
}
