import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PrismaService, ConfigService],
})
export class PermissionsModule {}
