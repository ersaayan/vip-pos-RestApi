import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateStockCartDto {
  @IsArray()
  @IsString({ each: true })
  phoneIds: string[];

  @IsArray()
  @IsString({ each: true })
  caseModelVariations: string[];

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
  cost: number;

  @IsOptional()
  quantity: number;

  @IsOptional()
  caseImage: any; // Multipart form data için
}
