import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCaseModelVariationDto {
  @IsString()
  @IsNotEmpty()
  modelVariation: string;

  @IsString()
  @IsNotEmpty()
  modelVariationEng: string;

  @IsString()
  @IsNotEmpty()
  myorGroupCode: string;
}
