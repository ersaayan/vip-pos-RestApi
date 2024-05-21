import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  email: string;
  name: string;
  password: string;
  roles: $Enums.Role[];
  createdAt: Date;
  updatedAt: Date;
}
