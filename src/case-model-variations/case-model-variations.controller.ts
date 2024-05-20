import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CaseModelVariationsService } from './case-model-variations.service';
import { CreateCaseModelVariationDto } from './dto/create-case-model-variation.dto';
import { UpdateCaseModelVariationDto } from './dto/update-case-model-variation.dto';

@Controller('case-model-variations')
export class CaseModelVariationsController {
  constructor(
    private readonly caseModelVariationsService: CaseModelVariationsService,
  ) {}

  @Post()
  create(@Body() createCaseModelVariationDto: CreateCaseModelVariationDto) {
    return this.caseModelVariationsService.create(createCaseModelVariationDto);
  }

  @Get()
  findAll() {
    return this.caseModelVariationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseModelVariationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCaseModelVariationDto: UpdateCaseModelVariationDto,
  ) {
    return this.caseModelVariationsService.update(
      id,
      updateCaseModelVariationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseModelVariationsService.remove(id);
  }
}
