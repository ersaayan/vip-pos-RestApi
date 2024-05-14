import { Phone } from '@prisma/client';

export class PhoneEntity implements Phone {
  constructor(partial: Partial<PhoneEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  brand: string;
  model: string;
  name: string;
  groupCode: string;
  stockCode: string;
  createdAt: Date;
  updatedAt: Date;
}
