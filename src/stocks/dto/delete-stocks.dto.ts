import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteStocksEntity {
  @ApiProperty({ required: true, description: 'Stock Kart ids' })
  @IsArray()
  @IsNotEmpty()
  ids: string[];
}
