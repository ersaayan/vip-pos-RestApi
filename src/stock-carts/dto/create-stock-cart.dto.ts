import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateStockCartDto {
  @IsArray()
  phoneIds: string;

  @IsArray()
  caseModelVariationsIds: string;

  @IsString()
  @IsNotEmpty()
  caseBrandId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  barcode: string;

  @IsString()
  @IsOptional()
  satisFiyat1: string;

  @IsString()
  @IsOptional()
  satisFiyat2: string;

  @IsString()
  @IsOptional()
  satisFiyat3: string;

  @IsString()
  @IsOptional()
  satisFiyat4: string;

  @IsOptional()
  cost: string;

  @IsOptional()
  quantity: string;

  @IsOptional()
  caseImage: any; // Multipart form data için
}
