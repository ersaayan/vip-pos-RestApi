import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseBrandDto } from './create-case-brand.dto';

export class UpdateCaseBrandDto extends PartialType(CreateCaseBrandDto) {}
