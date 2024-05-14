import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhonesService } from './phones.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PhoneEntity } from './entities/phone.entity';

@Controller('phones')
export class PhonesController {
  constructor(private readonly phonesService: PhonesService) {}

  @Post()
  async create(@Body() createPhoneDto: CreatePhoneDto) {
    return new PhoneEntity(await this.phonesService.create(createPhoneDto));
  }

  @Post('many')
  async createMany(@Body() createPhoneDto: CreatePhoneDto[]) {
    const phones = await Promise.all(
      createPhoneDto.map((phoneDto) => this.phonesService.create(phoneDto)),
    );
    return phones.map((phone) => new PhoneEntity(phone));
  }

  @Get()
  async findAll() {
    const phones = await this.phonesService.findAll();
    return phones.map((phone) => new PhoneEntity(phone));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new PhoneEntity(await this.phonesService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    return new PhoneEntity(await this.phonesService.update(id, updatePhoneDto));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new PhoneEntity(await this.phonesService.remove(id));
  }
}
