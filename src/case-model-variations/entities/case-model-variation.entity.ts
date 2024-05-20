import { CaseModelVariation } from '@prisma/client';

export class CaseModelVariationEntity implements CaseModelVariation {
  id: string;
  modelVariation: string;
  modelVariationEng: string;
  myorGroupCode: string;
  createdAt: Date;
  updatedAt: Date;
}
