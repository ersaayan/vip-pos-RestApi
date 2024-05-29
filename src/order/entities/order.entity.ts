import { Order } from '@prisma/client';

export class OrderEntity implements Order {
  id: string;
  stockCartId: string;
  orderCost: number;
  userId: string;
  statusId: string;
  createdAt: Date;
  updatedAt: Date;
}
