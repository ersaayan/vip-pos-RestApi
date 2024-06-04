import { Status } from '@prisma/client';

export class StatusEntity implements Status {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
