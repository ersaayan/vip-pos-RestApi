import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true, description: 'Stock Name' })
  @IsString()
  @IsNotEmpty()
  PhoneBrandModelName: string;

  @ApiProperty({ required: true, description: 'Stock Code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  PhoneBrandModelStockCode: string;

  @ApiProperty({ required: true, description: 'Brand Name' })
  @IsString()
  @IsNotEmpty()
  PhoneBrandName: string;

  @ApiProperty({ required: true, description: 'Group Code For İkas' })
  @IsString()
  @IsNotEmpty()
  PhoneModelGroupCode: string;

  @ApiProperty({ required: true, description: 'Description' })
  @IsString()
  @IsOptional()
  Description: string;

  @ApiProperty({ required: true, description: 'Barcode' })
  @IsNumber()
  @IsNumber()
  Barcode: number;
}
