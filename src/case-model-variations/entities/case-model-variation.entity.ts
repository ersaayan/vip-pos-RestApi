import { CaseModelVariation } from '@prisma/client';

export class CaseModelVariationEntity implements CaseModelVariation {
  id: string;
  modelVariation: string;
  myorGroupCode: string;
  createdAt: Date;
  updatedAt: Date;
}
