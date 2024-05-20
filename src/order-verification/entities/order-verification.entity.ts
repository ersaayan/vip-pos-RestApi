import { PlatformOrderVerification } from '@prisma/client';

export class OrderVerificationEntity implements PlatformOrderVerification {
  constructor(partial: Partial<OrderVerificationEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  kargoTakipNo: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
