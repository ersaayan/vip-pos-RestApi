import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderVerificationDto } from './create-order-verification.dto';

export class UpdateOrderVerificationDto extends PartialType(CreateOrderVerificationDto) {}
