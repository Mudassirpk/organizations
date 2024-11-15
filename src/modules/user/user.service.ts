import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { AddMemberDTO } from './dto/add-member.dto';
import { randomString } from 'src/shared/utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    return await this.prisma.user.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        user_organization: {
          select: {
            organization: true,
          },
        },
      },
    });
  }

  async create(createDto: CreateUserDTO) {
    try {
      const password = await bcryptjs.hash(createDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: createDto.name,
          email: createDto.email,
          password,
          user_organization: {
            create: {
              role: {
                create: {
                  name: 'ADMIN',
                },
              },
              organization: {
                create: {
                  name: createDto.organizationName,
                },
              },
            },
          },
        },
      });

      return { success: true, user };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  }

  async addMember(addDto: AddMemberDTO, adminId: number) {
    try {
      const admin_organization = await this.prisma.user_organization.findFirst({
        where: { userId: adminId },
      });

      const user_exists_in_organization =
        await this.prisma.user_organization.findFirst({
          where: {
            user: {
              email: addDto.email,
            },
          },
        });

      if (user_exists_in_organization)
        return {
          success: false,
          message: 'member with same email already exists',
        };

      const randomPassword = randomString(8);
      console.log('RP:', randomPassword);
      const password = await bcryptjs.hash(randomPassword, 10);

      const member = await this.prisma.user.create({
        data: {
          name: addDto.name,
          email: addDto.email,
          password,
          user_organization: {
            create: {
              role: {
                connect: { id: addDto.roleId },
              },
              organization: {
                connect: { id: admin_organization.organizationId },
              },
            },
          },
        },
      });
      return { success: true, member };
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        return {
          success: false,
          message: `member with same ${error.meta.target[0]} already exists`,
        };
      }
      return {
        success: false,
        error,
      };
    }
  }
}
