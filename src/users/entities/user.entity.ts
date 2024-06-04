import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  name: string;
  role: $Enums.Role;

  @ApiProperty()
  id: string;
  email: string;
  name: string;
  password: string;
  roles: $Enums.Role[];
  createdAt: Date;
  updatedAt: Date;
}
