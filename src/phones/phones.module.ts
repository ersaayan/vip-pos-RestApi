import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PhonesController],
  providers: [PhonesService],
  imports: [PrismaModule],
  exports: [PhonesService],
})
export class PhonesModule {}
