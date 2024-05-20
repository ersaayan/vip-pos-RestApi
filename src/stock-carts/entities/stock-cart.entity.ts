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
  satisFiyat1: number;
  satisFiyat2: number;
  satisFiyat3: number;
  satisFiyat4: number;
  quantity: number;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
