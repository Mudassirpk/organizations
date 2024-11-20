import { Module } from '@nestjs/common';
import { AtomService } from './atom.service';
import { AtomController } from './atom.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [AtomController],
  providers: [AtomService, PrismaService],
})
export class AtomModule {}
