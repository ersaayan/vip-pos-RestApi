import { StockCart } from '@prisma/client';

export class StockCartEntity implements StockCart {
  constructor(partial: Partial<StockCartEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  phoneId: string;
  caseBrand: string;
  caseModelVariation: string;
  caseImage: string;
  title: string;
  description: string;
  barcode: string;
  cost: number;
  quantity: number;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
