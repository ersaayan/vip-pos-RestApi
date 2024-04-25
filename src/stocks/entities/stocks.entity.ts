import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StockKart } from '@prisma/client';

export class StocksEntity implements StockKart {
  id: string;

  @ApiProperty()
  CaseBrand: string;

  @ApiProperty({ type: 'file', format: 'binary' })
  CaseModelImage: string;

  @ApiProperty()
  CaseModelVariations: string[];

  @ApiProperty()
  CaseModelTitle: string;

  @ApiProperty()
  ProductIds: string[];

  @ApiPropertyOptional()
  Description: string;

  @ApiPropertyOptional()
  Barcode: string;

  createdAt: Date;

  updatedAt: Date;
}
