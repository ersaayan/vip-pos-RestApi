import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';

export class ProductEntity implements Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  PhoneBrandModelName: string;

  @ApiProperty()
  PhoneBrandModelStockCode: string;

  @ApiProperty()
  PhoneBrandName: string;

  @ApiProperty()
  PhoneModelGroupCode: string;

  @ApiProperty()
  Description: string;

  @ApiProperty()
  Barcode: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  stockKartId: string;
}
