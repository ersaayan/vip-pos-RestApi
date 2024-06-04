import { PartialType } from '@nestjs/mapped-types';
import { CreateStockCartDto } from './create-stock-cart.dto';

export class UpdateStockCartDto extends PartialType(CreateStockCartDto) {}
