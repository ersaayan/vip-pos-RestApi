import { CaseBrand } from '@prisma/client';

export class CaseBrandEntity implements CaseBrand {
  id: string;
  brandName: string;
  myorGroupCode: string;
  createdAt: Date;
  updatedAt: Date;
}
