import { PartialType } from '@nestjs/mapped-types';
import { CreateCaseModelVariationDto } from './create-case-model-variation.dto';

export class UpdateCaseModelVariationDto extends PartialType(CreateCaseModelVariationDto) {}
