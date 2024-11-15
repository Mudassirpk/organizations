import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AssignPermissionDto } from "./dto/assign-permission.dto";

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    //TODO: later change this so, that only organization's admin can perfom this action

    if (createPermissionDto.resourceActions) {
      return await this.prisma.permission.create({
        data: {
          organization: {
            connect: { id: createPermissionDto.organizationId },
          },
          resourceActions: createPermissionDto.resourceActions,
        },
      });
    }

    return await this.prisma.permission.create({
      data: {
        resource: { connect: { id: createPermissionDto.resource } },
        action: createPermissionDto.action,
        organization: {
          connect: { id: createPermissionDto.organizationId },
        },
      },
    });
  }

  async assign({ user, permission }: AssignPermissionDto) {
    return await this.prisma.user_permission.create({
      data: {
        userId: user,
        permissionId: permission,
      },
    });
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
