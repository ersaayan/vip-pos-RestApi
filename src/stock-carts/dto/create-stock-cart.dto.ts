import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateStockCartDto {
  @IsArray()
  phoneIds: string;

  @IsArray()
  caseModelVariations: string;

  @IsString()
  @IsOptional()
  caseBrand: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  barcode: string;

  @IsOptional()
  cost: string;

  @IsOptional()
  quantity: string;

  @IsOptional()
  caseImage: any; // Multipart form data için
}
