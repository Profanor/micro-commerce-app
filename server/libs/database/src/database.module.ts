import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@micro-lib/database/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
