import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: createRoleDto.roleName,
          organizationId: createRoleDto.organizationId,
        },
      });

      return {
        success: true,
        role,
        message: 'Role created successfully.',
      };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        return {
          success: false,
          message: `role with same ${error.meta.target[0]} already exists`,
        };
      }
      return { success: false, error, message: error.message };
    }
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  rolesByOrganization(organizationId: number) {
    return this.prisma.role.findMany({
      where: {
        organizationId: organizationId,
      },
    });
  }
}
