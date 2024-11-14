import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [ResourceController],
  providers: [ResourceService, PrismaService],
})
export class ResourceModule { }
