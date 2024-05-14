import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePhoneDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  groupCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  stockCode: string;
}
