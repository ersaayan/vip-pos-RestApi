import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCaseBrandDto {
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  myorGroupCode: string;
}
